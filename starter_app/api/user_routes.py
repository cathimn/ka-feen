from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from starter_app.models import db, User, Tag, users_tags

user_routes = Blueprint('users', __name__)


@user_routes.route('/search=<query>')
def search(query):
  res = User.query.filter(db.or_(User.username.like(
      f'%{query}%'), User.display_name.like(f'%{query}%')))
  return {"results": [result.to_dict() for result in res]}


@user_routes.route('/')
def index():
  response = User.query.all()
  return {"users": [user.id for user in response]}
