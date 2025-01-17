from app.models import db, environment, SCHEMA, user_game_association
from sqlalchemy.sql import text

# Adds demo games
def seed_user_game_association():

    users_games_data = [
        {'user_id': 1, 'game_id': 1},
        {'user_id': 1, 'game_id': 2},
        {'user_id': 1, 'game_id': 3},
        {'user_id': 2, 'game_id': 3},
        {'user_id': 2, 'game_id': 4},
        {'user_id': 3, 'game_id': 2},
        {'user_id': 3, 'game_id': 3},
        {'user_id': 3, 'game_id': 4},

    ]
  
    for data in users_games_data:
        dataObj = user_game_association.insert().values(
            user_id=data['user_id'],
            game_id=data['game_id']
        )
        db.session.execute(dataObj)
    
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the user_game_association table.
# SQLAlchemy doesn't have a built-in function to do this.
# With Postgres in production, TRUNCATE removes all the data from the table,
# and RESET IDENTITY resets the auto-incrementing primary key, CASCADE deletes
# any dependent entities. With SQLite in development, use DELETE to remove
# all data and it will reset the primary keys for you as well.
def undo_user_game_association():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_game_association RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM user_game_association"))

    db.session.commit()
