from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from starter_app.models import db, User

follow_routes = Blueprint('follows', __name__)


@follow_routes.route('/', methods=['GET', 'POST', 'DELETE'])
@jwt_required
def follows():
  current_user = get_jwt_identity()
  user = User.query.filter(User.email == current_user).first()

  if request.method == 'POST':
    follow = request.json.get("follow")
    print(follow)
    to_follow = User.query.filter(User.username == follow).first()
    user.follow(to_follow)
    db.session.add(user)
    db.session.commit()
    return jsonify(msg=f'{user.username} is now following {follow}!')
  elif request.method == 'DELETE':
    unfollow = request.json.get("unfollow")
    to_unfollow = User.query.filter(User.username == unfollow).first()
    user.unfollow(to_unfollow)
    db.session.add(user)
    db.session.commit()
    return jsonify(msg=f'{user.username} has unfollowed {unfollow}!')


  return {'following': [{
    "id": follow.id,
    "avatarUrl": follow.avatar_url,
    "username": follow.username,
    "diplayName": follow.display_name,
    } for follow in user.follows if follow.id != user.id]}
