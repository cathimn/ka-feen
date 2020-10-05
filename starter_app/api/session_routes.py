from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from starter_app.models import db, User

session_routes = Blueprint('session', __name__)


@session_routes.route('/logout', methods=['DELETE'])
@jwt_required
def logout():
  current_user = get_jwt_identity()
  user = User.query.filter(User.email == current_user).first()
  if user.session_token == None:
      return jsonify(msg="Session does not exist"), 400
  user.session_token = None
  db.session.add(user)
  db.session.commit()
  return jsonify(msg="Session removed"), 200


@session_routes.route('/', methods=['POST', 'PUT'])
def index():
  if not request.is_json:
    return jsonify(msg="Missing JSON in request"), 400

  email = request.json.get("email")
  if not email:
    return jsonify(msg="Missing email"), 400
  
  password = request.json.get("password")
  if not password:
    return jsonify(msg="Missing password"), 400
  
  # LOGIN
  if request.method == 'PUT':
    user = User.query.filter(User.email == email).first()
    if not user or not user.check_password(password):
      return jsonify(msg="Bad email/password combination."), 401

  # SIGN UP
  elif request.method =="POST":
    username = request.json.get("username")
    if not username:
      return jsonify(msg="Missing username"), 400
    user = User(username=username, email=email, password=password)
    user.follow(user)

  # CREATE AND ASSIGN SESSION TOKEN IN DB
  access_token = create_access_token(identity=user.email)
  user.session_token = access_token
  db.session.add(user)
  db.session.commit()
  return jsonify(token=access_token, id=user.id, username=user.username, display_name=user.display_name), 200


@session_routes.route("/", methods=["GET"])
@jwt_required
def verify():
  current_user_email = get_jwt_identity()
  user = User.query.filter(User.email == current_user_email).first()
  if not user:
    return jsonify(msg="Invalid session"), 401
  return {
    "token": user.session_token,
    "id": user.id,
    "username": user.username,
    "displayName": user.display_name }
