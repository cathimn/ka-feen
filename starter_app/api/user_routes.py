from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from starter_app.models import db, User, Tag, users_tags

user_routes = Blueprint('users', __name__)


@user_routes.route('/search=<query>')
def search(query):
  res = User.query.filter(db.or_(User.username.like(
      f'%{query}%'), User.display_name.like(f'%{query}%')))
  return {"results": [result.to_dict() for result in res]}


@user_routes.route('/settings')
@jwt_required
def user_settings():
  current_user = get_jwt_identity()
  user = User.query.filter(User.email == current_user).first()
  return user.to_dict()


@user_routes.route('/')
def index():
  response = User.query.all()
  return {"users": [user.to_dict() for user in response]}


@user_routes.route('/<username>')
def user(username):
    response = User.query.filter(User.username == username).first()
    return response.to_dict()


@user_routes.route('/feed')
@jwt_required
def feed():
  current_user = get_jwt_identity()
  user = User.query.filter(User.email == current_user).first()
  response = user.retrieve_feed()
  return {"feed": [post for post in response]}


@user_routes.route('/tags')
def tags():    
  tags = Tag.query.all();
  return {"tags": [tag.to_dict() for tag in tags]}


@user_routes.route('/tags/id=<tag_id>', methods=["PATCH", "DELETE"])
@jwt_required
def update_tags(tag_id):
  current_user = get_jwt_identity()
  if not current_user:
    return jsonify(msg="Invalid user"), 400

  
  tag = Tag.query.filter(Tag.id == tag_id).first()
  if not tag:
    return jsonify(msg-"Invalid tag"), 400

  if request.method == "PATCH":
    user.add_tag(tag)
  
  if request.method == "DELETE":
    user.remove_tag(tag)

  db.session.add(user)
  db.session.commit()

  return user.users_tags


@user_routes.route('/tag/id=<tag_id>')
def users_with_tag(tag_id):
  tag = Tag.query.filter(Tag.id == tag_id).first()

  if not tag:
    return jsonify(msg="Invalid tag"), 400

  request = User.query.join(
    users_tags, (users_tags.c.user_id == User.id)).filter(
      users_tags.c.tag_id == tag_id).all()
  return {"users_with_tag": [{
    "id": user.id,
    "avatar_url": user.avatar_url,
    "banner_url": user.banner_url,
    "username": user.username,
    "display_name": user.display_name,
  } for user in request]}
