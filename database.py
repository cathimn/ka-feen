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
      'Animation', 'Art', 'Comics', 'Drawing & Painting',
      'Food & Drink', 'Gaming', 'Music', 'Other', 'Photography', 'Podcast',
      'Science & Tech', 'Social', 'Software', 'Streaming', 'Video & Film',
      'Writing'
  ]
  for tag in tags:
      db.session.add(Tag(tag_name=tag))

  captain = User(username='captaincat',
                 email='captain@thecat.com',
                 password = SEED_USERS_PASSWORD,
                 bio="a loud cat that gallops around the house at 3am")
  luna = User(username='lunacat',
              email='luna@thecat.com',
              password = SEED_USERS_PASSWORD,
              bio = "I'm a small cat!!!",
              accept_payments = True,
              display_name = "mewna")
  cath = User(display_name ="Cath", username='cathimn',
              email='cath@thecat.com', bio=':-D',
              password = SEED_USERS_PASSWORD)
  bobo = User(username='boston', display_name="Bobo", bio="fighting gamer",
              email='boston@person.com',
              password = SEED_USERS_PASSWORD)
  jenni = User(username='jenni', display_name="jennip", bio="I love creating beautiful nail art!",
              email='jenni@fashion.com',
              password = SEED_USERS_PASSWORD)
  jee = User(username='jeebee', display_name="JEE",
              email='jeebee@dude.info', bio='beeeeeeeeeeeee',
             password=SEED_USERS_PASSWORD, accept_payments=True,)

  db.session.add(captain)
  db.session.add(luna)
  db.session.add(cath)
  db.session.add(bobo)
  db.session.add(jenni)
  db.session.add(jee)

  post1 = Post(user_id=1, body="Meow meow!!!")
  post3 = Post(user_id=2, body="Mew mew!!!")
  post6 = Post(user_id=6, body="PEACH TIME!!!")

  db.session.add(post1)
  db.session.add(post3)
  db.session.add(post6)

  db.session.add(
      Post(user_id=3, body="HELLO WORLD"))

  cath.like_post(post1)
  bobo.like_post(post1)
  jee.like_post(post1)

  captain.follow(captain)
  luna.follow(luna)
  cath.follow(cath)
  bobo.follow(bobo)
  jenni.follow(jenni)
  jee.follow(jee)
  cath.follow(captain)
  cath.follow(luna)
  cath.follow(jee)

  test = Support(user_id=2,
                 supporter_id=3,
                 amount=1,
                 body="<3")
  test_again = Support(user_id=2,
                       supporter_id=3,
                       amount=2,
                       body="<3!",
                       private=True)

  db.session.add(test)
  db.session.add(test_again)

  db.session.commit()
