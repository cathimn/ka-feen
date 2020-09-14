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
  bio = db.Column(db.String())
  accept_payments = db.Column(db.Boolean, default=False)
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

  user_likes = db.relationship('Post', secondary=users_likes, lazy="subquery", back_populates="users")
  user_tags = db.relationship('Tag', secondary=users_tags, lazy="subquery", back_populates='users')
  posts = db.relationship('Post', lazy="subquery", back_populates='user')
  follows = db.relationship('User',
                            lazy="subquery",
                            secondary=following,
                            primaryjoin=id == following.c.user_id,
                            secondaryjoin=id == following.c.follow_id)

  def to_dict(self):
    return {
      "id": self.id,
      "username": self.username,
      "display_name": self.display_name,
      "avatar_url": self.avatar_url,
      "banner_url": self.banner_url,
      "bio": self.bio,
      "accept_payments": self.accept_payments,
      "tags": [tag.to_dict() for tag in self.user_tags],
      "posts": [post.to_dict() for post in self.posts],
    }

  def retrieve_feed(self):
    return [post.to_dict() for post in Post.query.join(
      following, (following.c.follow_id == Post.user_id)).filter(
      following.c.user_id == self.id).order_by(Post.created_at.desc())]

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

  def like_post(self, post_to_like):
    if post_to_like not in self.user_likes:
      self.user_likes.append(post_to_like)

  def unlike_post(self, post_to_unlike):
    if post_to_unlike in self.user_likes:
      self.user_likes.remove(post_to_unlike)

  def add_tag(self, tag_to_add):
    if tag_to_add not in self.user_tags and len(self.user_tags) < 3:
      self.user_tags.append(tag_to_add)
  
  def remove_tag(self, tag_to_remove):
    if tag_to_remove in self.user_tags:
      self.user_tags.remove(tag_to_remove)


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

  user = db.relationship('User', lazy="subquery", back_populates='posts')
  users = db.relationship('User', secondary=users_likes, lazy="subquery",
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
  
  users = db.relationship('User', secondary=users_tags, lazy="subquery", back_populates='user_tags')

  def to_dict(self):
    return {
      "id": self.id,
      "tag_name": self.tag_name
    }
