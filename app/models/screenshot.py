from .user import User
from .game import Game
from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Screenshot(db.Model):
    __tablename__ = 'screenshots'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')), nullable=False)
    image_url = db.Column(db.String(255))
    description = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)

    # One-to-Many Relationships
    game = db.relationship('Game', back_populates='screenshots')
    user = db.relationship('User', back_populates='screenshots')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'game_id': self.game_id,
            'image_url': self.image_url,
            'description': self.description,
            'created_at': self.created_at
        }