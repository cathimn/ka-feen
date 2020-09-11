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
  bobo = User(username='boston',
              email='boston@person.com',
              password = SEED_USERS_PASSWORD)
  jenni = User(username='jenni',
              email='jenni@chanel.com',
              password = SEED_USERS_PASSWORD)
  jee = User(username='jeebee',
              email='jeebee@doodoo.info',
              password = SEED_USERS_PASSWORD)

  db.session.add(captain)
  db.session.add(luna)
  db.session.add(cath)
  db.session.add(bobo)
  db.session.add(jenni)
  db.session.add(jee)

  post1 = Post(user_id=1, body="Meow meow!!!")
  post2 = Post(user_id=1, body="I'm Captain!")
  post3 = Post(user_id=2, body="Mew mew!!!")
  post4 = Post(user_id=2, body="I'm Luna~")
  post5 = Post(user_id=6, body="I like my iPad.")
  post6 = Post(user_id=6, body="PEACH TIME!!!")

  # print(post1.to_dict())

  db.session.add(post1)
  db.session.add(post2)
  db.session.add(post3)
  db.session.add(post4)
  db.session.add(post5)
  db.session.add(post6)

  db.session.add(
      Post(user_id=3, body="This is Catherine making a test post..."))

  captain.follow(captain)
  luna.follow(luna)
  cath.follow(cath)
  bobo.follow(bobo)
  jenni.follow(jenni)
  cath.follow(captain)
  cath.follow(luna)
  cath.follow(jee)

  cath.like_post(post1)
  cath.like_post(post2)
  cath.like_post(post3)

  cath.add_tag(Tag.query.filter(Tag.id == 1).first())
  cath.add_tag(Tag.query.filter(Tag.id == 4).first())
  cath.add_tag(Tag.query.filter(Tag.id == 15).first())


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
