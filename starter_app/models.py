from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

following = db.Table(
    'follows',
    db.Column('user_id', db.Integer, db.ForeignKey(
        'users.id'), primary_key=True),
    db.Column('follow_id', db.Integer, db.ForeignKey(
        'users.id'), primary_key=True),
)

users_tags = db.Table(
    'users_tags',
    db.Column('user_id',
              db.Integer,
              db.ForeignKey('users.id'),
              primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'),
              primary_key=True))

users_likes = db.Table(
    'users_likes',
    db.Column('user_id',
              db.Integer,
              db.ForeignKey('users.id'),
              primary_key=True),
    db.Column('post_id',
              db.Integer,
              db.ForeignKey('posts.id'),
              primary_key=True))

class User(db.Model):
  __tablename__ = 'users'

  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(40), nullable=False, unique=True)
  email = db.Column(db.String(255), nullable=False, unique=True)
  display_name = db.Column(db.String(40))
  hashed_password = db.Column(db.String(100), nullable=False)
  session_token = db.Column(db.String(), unique=True)
  avatar_url = db.Column(db.String())
  banner_url = db.Column(db.String())
  accept_payments = db.Column(db.Boolean, default=False)
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

  user_likes = db.relationship('Post', secondary=users_likes, back_populates="users")
  user_tags = db.relationship('Tag', secondary=users_tags, back_populates='users')
  posts = db.relationship('Post', back_populates='user')
  follows = db.relationship('User',
                            secondary=following,
                            primaryjoin=id == following.c.user_id,
                            secondaryjoin=id == following.c.follow_id)

  def to_dict(self):
    return {
      "id": self.id,
      "username": self.username,
      "display_name": self.display_name,
      "session_token": self.session_token,
    }

  @property
  def password(self):
      return self.hashed_password

  @password.setter
  def password(self, password):
      self.hashed_password = generate_password_hash(password)

  def check_password(self, password):
      return check_password_hash(self.password, password)

  def follow(self, to_follow):
      if to_follow not in self.follows:
          self.follows.append(to_follow)

  def unfollow(self, to_unfollow):
      if to_unfollow in self.follows:
          self.follows.remove(to_unfollow)

  def is_following(self, user_to_check):
      return user_to_check in self.follows


class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    body = db.Column(db.String(140))
    image_url = db.Column(db.String())
    created_at = db.Column(db.DateTime,
                           nullable=False,
                           default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    user = db.relationship('User', back_populates='posts')
    users = db.relationship('User', secondary=users_likes,
                            back_populates='user_likes')

    def to_dict(self):
        return {
            "id": self.id,
            "author": User.query.get(self.user_id).username,
            "body": self.body,
            "image_url": self.image_url,
            "posted_on": str(self.created_at)
        }


class Support(db.Model):
    __tablename__ = 'supports'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    supporter_id = db.Column(db.Integer,
                             db.ForeignKey('users.id'),
                             nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    body = db.Column(db.Text)
    private = db.Column(db.Boolean)

    supported_user = db.relationship('User', foreign_keys=[user_id])
    supporting_user = db.relationship('User', foreign_keys=[supporter_id])

    __table_args__ = (db.CheckConstraint(user_id != supporter_id,
                                         name='cannot_support_yourself'), )


class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(40), nullable=False, unique=True)
    
    users = db.relationship('User', secondary=users_tags, back_populates='user_tags')
