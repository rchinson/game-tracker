from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    mike = User(
            username='mike',
            first_name='Michael',
            last_name="Jordan", 
            email='mike@aa.io', 
            password='password',
            avatar='https://knilt.arcc.albany.edu/images/8/88/Michael_Jordan.jpg',
            about_me='I play basketball.',
            number_of_games=3,
            number_of_reviews=2
        )
    stephen = User(
            username='stephen',
            first_name='Stephen',
            last_name="Colbert", 
            email='stephen@aa.io', 
            password='password',
            avatar='https://img.nbc.com/the-tonight-show/content/sites/nbcutsjf/files/images/2018/10/09/stephen-colbert.jpg',
            about_me='Watch my television show.',
            number_of_games=3,
            number_of_reviews=2,
        )
    jeff = User(
            username='jeff',
            first_name='Jeff',
            last_name="Bezos", 
            email='jeff@aa.io', 
            password='password',
            avatar='https://media.newyorker.com/photos/5c61ae25f36fcb4eed3ac64f/master/pass/Chotiner-How-Jeff-Bezos-Sees-the-Press.jpg',
            about_me='CEO of Amazon.',
            number_of_games=3,
            number_of_reviews=2
        )

    db.session.add(mike)
    db.session.add(stephen)
    db.session.add(jeff)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
