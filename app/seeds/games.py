from app.models import db, Game, environment, SCHEMA
from sqlalchemy.sql import text

# Adds demo games
def seed_games():
    game1 = Game(
        user_id=1,
        creator_id=1,
        title='Fortnite',
        image='https://wallpapers.com/images/hd/fortnite-1920x1080-hd-cvavgntkwzkn72rg.jpg',
        description='A free-for-all survival on a big map!',
        genre='Battle Royale',
        platform='PC',
        price=0,

    )
    game2 = Game(
        user_id=2,
        creator_id=1,
        title='Minecraft',
        image='https://www.dexerto.com/cdn-image/wp-content/uploads/2023/08/04/minecraft-bedrock-thumb.jpg',
        description='Build a base with solo or with a friend to survive the night!',
        genre='Survival',
        platform='PC',
        price=29.99,
    )
    game3 = Game(
        user_id=3,
        creator_id=1,
        title='Rocket League',
        image='https://www.rocketleague.com/images/keyart/rl_evergreen.jpg',
        description='Fly through the air to score more goals than your opponent!',
        genre='Sports',
        platform='PC',
        price=0,
    )
    game4 = Game(
        user_id=1,
        creator_id=1,
        title='Halo',
        image='https://wpassets.halowaypoint.com/wp-content/2021/12/HaloInfinite_CampaignKeyArt_CLEAN_1920x1080.jpg',
        description='Play as Master Chief to defeat the Covenant!',
        genre='First Person Shooter',
        platform='PC',
        price=39.99,
    )

    db.session.add(game1)
    db.session.add(game2)
    db.session.add(game3)
    db.session.add(game4)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the games table.
# SQLAlchemy doesn't have a built-in function to do this.
# With Postgres in production, TRUNCATE removes all the data from the table,
# and RESET IDENTITY resets the auto-incrementing primary key, CASCADE deletes
# any dependent entities. With SQLite in development, use DELETE to remove
# all data and it will reset the primary keys for you as well.
def undo_games():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.games RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM games"))

    db.session.commit()
