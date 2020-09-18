from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from starter_app.models import db, User, Post, users_likes
from werkzeug.utils import secure_filename
import boto3
import os

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
    if not body:
      return jsonify(msg="Requires content"), 401
    post = Post(user_id=user_id, body=body)
    if "image" in request.files:
      file = request.files["image"]
      file.filename = secure_filename(file.filename)
      folder = f'{user_id}/posts/'
      output = upload_to_s3(file, folder, BUCKET_NAME)
      image_url = (str(output))
      post.image_url = image_url

    db.session.add(post)
    db.session.commit()
    return post.to_dict()
