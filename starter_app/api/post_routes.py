from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from starter_app.models import db, User, Post, users_likes

post_routes = Blueprint('posts', __name__)


# @post.routes.route('/', methods=['POST', 'PATCH', 'DELETE'])
# def index():
#   if request.method == 'POST':
#     return "ahh!"
