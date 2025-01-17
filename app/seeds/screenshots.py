from app.models import db, Screenshot, environment, SCHEMA
from sqlalchemy.sql import text

# Adds demo screenshots
def seed_screenshots():
    screenshot1 = Screenshot(
        user_id=1,
        game_id=1,
        image_url = 'https://cdn.mobygames.com/screenshots/7830613-fortnite-playstation-4-night-walk.jpg',
        description='A duos game with my friend',

    )
    screenshot2 = Screenshot(
        user_id=2,
        game_id=2,
        image_url = 'https://ccdn.g-portal.com/large_Gallery_Blog_MC_Screenshots_0001_2_b33993315b.jpg',
        description='Running through the forest',
    )
    screenshot3 = Screenshot(
        user_id=3,
        game_id=3,
        image_url = 'https://cdn.mobygames.com/screenshots/1659900-rocket-league-playstation-4-first-goal-in-overtime-ends-the-matc.jpg',
        description='Win in overtime',
    )
    screenshot4 = Screenshot(
        user_id=3,
        game_id=4,
        image_url = 'https://cdn.mobygames.com/screenshots/10089841-halo-combat-evolved-windows-covenant-boarding-parties-attacking-.jpg',
        description='A new playthrough',
    )
    screenshot5 = Screenshot(
        user_id=2,
        game_id=1,
        image_url = 'https://pm1.aminoapps.com/7528/78a88f607fe8a1035698e0b7f13b2629f21beb9er1-1280-720v2_hq.jpg',
        description='Playing in a squad',
    )
    screenshot6 = Screenshot(
        user_id=1,
        game_id=2,
        image_url = 'https://www.newgamenetwork.com/images/uploads/gallery/Minecraft/minecraft_05.jpg',
        description='Lots of torches',
    )


    screenshot7 = Screenshot(
        user_id=2,
        game_id=3,
        image_url = 'https://clips.rocket-league.com/508967f3-7532-441b-b8cb-fd5cff0acde1/thumbnail.jpg',
        description='Striker training',
    )

    db.session.add(screenshot1)
    db.session.add(screenshot2)
    db.session.add(screenshot3)
    db.session.add(screenshot4)
    db.session.add(screenshot5)
    db.session.add(screenshot6)
    db.session.add(screenshot7)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the games table.
# SQLAlchemy doesn't have a built-in function to do this.
# With Postgres in production, TRUNCATE removes all the data from the table,
# and RESET IDENTITY resets the auto-incrementing primary key, CASCADE deletes
# any dependent entities. With SQLite in development, use DELETE to remove
# all data and it will reset the primary keys for you as well.
def undo_screenshots():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.screenshots RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM screenshots"))

    db.session.commit()
