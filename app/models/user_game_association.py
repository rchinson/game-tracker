from .db import db, environment, SCHEMA, add_prefix_for_prod



user_game_association = db.Table(
    'user_game_association',
    db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('game_id', db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')), primary_key=True)
)
if environment == 'production':
    user_game_association.schema=SCHEMA
