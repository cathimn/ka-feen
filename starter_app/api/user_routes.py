from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from starter_app.models import db, User, Tag, Support, users_tags

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
  return {
    "username": user.username,
    "display_name": user.display_name,
    "accept_payments": user.accept_payments,
    "id": user.id,
    "bio": user.bio,
    "tags": user.to_dict()["tags"]
  }


@user_routes.route('/update', methods=["PUT"])
@jwt_required
def change_settings():
  current_user_email = get_jwt_identity()
  user = User.query.filter(User.email == current_user_email).first()
  new_username = request.json.get("username")
  new_display_name = request.json.get("display_name")
  new_bio = request.json.get("bio")
  new_payments = request.json.get("accept_payments")
  if new_username:
    user.username = new_username
  if new_display_name:
    user.display_name = new_display_name
  if new_bio:
    user.bio = new_bio
  user.accept_payments = new_payments

  tags_to_add = request.json.get("tags_to_add")
  for tag in tags_to_add:
    new_tag = Tag.query.get(tag)
    user.add_tag(new_tag)
  tags_to_remove = request.json.get("tags_to_remove")
  for tag in tags_to_remove:
    new_tag = Tag.query.get(tag)
    user.remove_tag(new_tag)
  db.session.add(user)
  db.session.commit()
  return {
      "username": user.username,
      "display_name": user.display_name,
      "accept_payments": user.accept_payments,
      "id": user.id,
      "bio": user.bio,
      "tags": user.to_dict()["tags"]
  }


@user_routes.route('/')
def index():
  response = User.query.all()
  return {"users": [user.to_dict() for user in response]}


@user_routes.route('/<username>/page=<page>')
@user_routes.route('/<username>', defaults={"page": 0})
def user(username, page):
  page_int = int(page)
  user = User.query.filter(User.username == username).first()
  if not user:
    return jsonify(msg="Invalid user"), 401
  supports = Support.query.filter(Support.user_id == user.id).all()
  supported = Support.query.filter(Support.supporter_id == user.id).filter(Support.private == False).all()
  feed = user.posts + supports + supported
  total_support = len(supports)
  feed.sort(key=lambda x: x.created_at, reverse=True)
  if page_int == 0:
    feed_page = feed[0:10]
  elif page_int > 0:
    start = (10 * page_int )+ 1
    end = 10 * (page_int + 1)
    feed_page = feed[slice(start,end)]
  user = user.to_dict()
  return {
    "id": user["id"],
    "username": user["username"],
    "display_name": user["display_name"],
    "avatar_url": user["avatar_url"],
    "banner_url": user["banner_url"],
    "tags": user["tags"],
    "accept_payments": user["accept_payments"],
    "bio": user["bio"],
    "userpage_feed": [item.to_dict() for item in feed_page],
    "total_support": total_support,
    "end_of_feed": True if len(feed_page) < 9 else None
  }

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
    "bio": user.bio,
    "username": user.username,
    "display_name": user.display_name,
  } for user in request]}
