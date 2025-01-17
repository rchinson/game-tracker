from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text

# Adds demo reviews
def seed_reviews():
    review1 = Review(
        user_id=1,
        game_id=1,
        title = 'A great game!',
        body='A super fun game to play!',
        starRating=5
    )
    review2 = Review(
        user_id=2,
        game_id=2,
        title = 'A good game',
        body='This game is fun to play!',
        starRating=4
    )
    review3 = Review(
        user_id=3,
        game_id=3,
        title = 'An OK game',
        body='It is an average game',
        starRating=3
    )
    review4 = Review(
        user_id=1,
        game_id=4,
        title = 'Not good',
        body='I really did not like this game!',
        starRating=1
    )
    review5 = Review(
        user_id=2,
        game_id=2,
        title = 'I like it!',
        body='I like to play with my friends.',
        starRating=4
    )
    review6 = Review(
        user_id=3,
        game_id=3,
        title = 'Flying through the air',
        body='Its like soccer but with a rocket car!',
        starRating=4
    )
    review7 = Review(
        user_id=1,
        game_id=4,
        title = 'Old but good',
        body='An old game but still fun to play.',
        starRating=4
    )

    db.session.add(review1)
    db.session.add(review2)
    db.session.add(review3)
    db.session.add(review4)
    db.session.add(review5)
    db.session.add(review6)
    db.session.add(review7)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the games table.
# SQLAlchemy doesn't have a built-in function to do this.
# With Postgres in production, TRUNCATE removes all the data from the table,
# and RESET IDENTITY resets the auto-incrementing primary key, CASCADE deletes
# any dependent entities. With SQLite in development, use DELETE to remove
# all data and it will reset the primary keys for you as well.
def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()
