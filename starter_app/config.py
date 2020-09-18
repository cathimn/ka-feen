from werkzeug.utils import secure_filename
import boto3
import os

class Config:
  SECRET_KEY=os.environ.get('SECRET_KEY')
  SQLALCHEMY_TRACK_MODIFICATIONS=False
  SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL')
  SQLALCHEMY_ECHO=False
  JWT_ACCESS_TOKEN_EXPIRES = False


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
