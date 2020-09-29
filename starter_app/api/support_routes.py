from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from starter_app.models import db, User, Support

support_routes = Blueprint('supports', __name__)


@support_routes.route('/', methods=['GET', 'POST'])
@jwt_required
def index():
  current_user_email = get_jwt_identity();
  current_user = User.query.filter(User.email == current_user_email).first()
  if request.method == 'POST':
    new_support = Support(
      user_id=request.json.get("user_id"),
      supporter_id=request.json.get("supporter_id"),
      amount=request.json.get("amount"),
      body=request.json.get("body"),
      private=request.json.get("private"),
      )
    db.session.add(new_support)
    db.session.commit()
    return new_support.to_dict()
  if request.method == 'GET':
    supports = Support.query.filter(Support.user_id == current_user.id).all()
    supported_by = Support.query.filter(Support.supporter_id == current_user.id).all();
    return {
      "received": [support.to_dict() for support in supports],
      "given": [support.to_dict() for support in supported_by]}
