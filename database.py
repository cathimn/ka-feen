import os
from starter_app.models import User, Tag, Post, Support
from starter_app import app, db
from dotenv import load_dotenv
load_dotenv()

SEED_USERS_PASSWORD = os.environ.get('SEED_USERS_PASSWORD')

with app.app_context():
  db.drop_all()
  db.create_all()

  tags = [
      'Animation', 'Art', 'Comics', 'Drawing & Painting', 'Education',
      'Food & Drink', 'Gaming', 'Music', 'Other', 'Photography', 'Podcast',
      'Science & Tech', 'Social', 'Software', 'Streaming', 'Video & Film',
      'Writing'
  ]
  for tag in tags:
      db.session.add(Tag(tag_name=tag))

  captain = User(username='captaincat',
                 email='captain@thecat.com',
                 password = SEED_USERS_PASSWORD)
  luna = User(username='lunacat',
              email='luna@thecat.com',
              password = SEED_USERS_PASSWORD)
  cath = User(username='cath',
              email='cath@thecat.com',
              password = SEED_USERS_PASSWORD)

  db.session.add(captain)
  db.session.add(luna)
  db.session.add(cath)

  db.session.add(Post(user_id=1, body="Meow meow!!!"))
  db.session.add(Post(user_id=1, body="I'm Captain!"))
  db.session.add(Post(user_id=2, body="Mew mew!!!"))
  db.session.add(Post(user_id=2, body="I'm Luna~"))

  db.session.add(
      Post(user_id=3, body="This is Catherine making a test post..."))

  captain.follow(captain)
  luna.follow(luna)
  cath.follow(cath)
  cath.follow(captain)
  cath.follow(luna)

  test = Support(user_id=2,
                 supporter_id=3,
                 amount=1,
                 body="My favorite cat! <3")
  test_again = Support(user_id=2,
                       supporter_id=3,
                       amount=2,
                       body="Cool girl. B-)",
                       private=True)
  db.session.add(test)
  db.session.add(test_again)

  db.session.commit()
