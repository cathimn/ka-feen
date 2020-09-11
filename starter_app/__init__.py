import os
from flask import Flask, render_template, request, session
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_jwt_extended import JWTManager

from starter_app.models import db, User
from starter_app.api.user_routes import user_routes
from starter_app.api.session_routes import session_routes
from starter_app.api.follow_routes import follow_routes
from starter_app.api.post_routes import post_routes

from starter_app.config import Config

app = Flask(__name__, static_url_path='')
app.url_map.strict_slashes = False

jwt = JWTManager(app)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(session_routes, url_prefix='/api/session')
app.register_blueprint(follow_routes, url_prefix='/api/follows')
app.register_blueprint(post_routes, url_prefix='/api/posts')
db.init_app(app)

## Application Security
CORS(app)
@app.after_request
def inject_csrf_token(response):
    response.set_cookie('csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') else None,
        httponly=True)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path>')
def react_root(path):
    return app.send_static_file('index.html')
