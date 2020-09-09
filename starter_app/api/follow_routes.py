from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from starter_app.models import db, User

follow_routes = Blueprint('follows', __name__)


@follow_routes.route('/', methods=['GET', 'POST', 'DELETE'])
# @jwt_required
def follows():
    user_id = request.json.get('id')
    follow_id = request.json.get('follow_id')
    user = User.query.filter(User.id == user_id).first()

    if request.method == 'POST':
        to_follow = User.query.filter(User.id == follow_id).first()
        user.follow(to_follow)
        db.session.add(user)
        db.session.commit()
        return jsonify(msg=f'{user.username} is now following {to_follow.username}!')
    elif request.method == 'DELETE':
        to_unfollow = User.query.filter(User.id == follow_id).first()
        user.unfollow(to_unfollow)
        db.session.add(user)
        db.session.commit()
        return jsonify(msg=f'{user.username} has unfollowed {to_unfollow.username}!')

    return {'following': [follow.username for follow in user.follows if follow.id != user.id]}
