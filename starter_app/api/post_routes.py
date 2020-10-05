from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from starter_app.models import db, User, Post, users_likes
from werkzeug.utils import secure_filename
import boto3
import os
from datetime import datetime

post_routes = Blueprint('posts', __name__)

BUCKET_URL = os.environ.get('BUCKET_URL')
BUCKET_NAME = os.environ.get('BUCKET_NAME')
ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY')
SECRET_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')

s3 = boto3.client(
  "s3",
  aws_access_key_id=ACCESS_KEY,
  aws_secret_access_key=SECRET_KEY
)

def upload_to_s3(file, folder, bucket_name, acl="public-read"):
  try:
    s3.upload_fileobj(file, bucket_name, folder + file.filename,
      ExtraArgs={"ACL": acl, "ContentType": file.content_type})
  except Exception as e:
    return e
  return f'{BUCKET_URL}/{folder}{file.filename}'


@post_routes.route('/', methods=['POST', 'DELETE'])
@jwt_required
def index():
  if request.method == "POST":
    user_id = request.form["user_id"]
    if not user_id:
      return jsonify(msg="Invalid user"), 401
    body = request.form["body"]
    if not body and not "image" in request.files:
      return jsonify(msg="Requires content"), 401
    post = Post(user_id=user_id, body=body)
    if "image" in request.files:
      file = request.files["image"]
      file.filename = secure_filename(file.filename)
      folder = f'{user_id}/posts/'
      output = upload_to_s3(file, folder, BUCKET_NAME)
      image_url = (str(output))
      post.image_url = image_url
    post.created_at = datetime.now()
    db.session.add(post)
    db.session.commit()
    return post.to_dict()
  if request.method == "DELETE":
    current_user_email = get_jwt_identity()
    user = User.query.filter(User.email == current_user_email).first()
    post_id = request.json.get("post_id")
    post = Post.query.get(post_id)
    if post.user.username is not user.username:
      return jsonify(msg="Invalid user"), 401
    db.session.delete(post)
    db.session.commit()
    return jsonify(msg="Successfully deleted post"), 200


@post_routes.route('/like', methods=["POST", "DELETE"])
@jwt_required
def like_post():
  post_id = request.json.get("post_id")
  post = Post.query.get(int(post_id))
  current_user_email = get_jwt_identity()
  user = User.query.filter(User.email == current_user_email).first()
  if request.method == "POST":
    user.like_post(post)
  if request.method == "DELETE":
    user.unlike_post(post)
  db.session.add(user)
  db.session.commit()
  return {"likers": post.to_dict()["likers"]}

