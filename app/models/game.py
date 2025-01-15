from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from .db import user_game_association


class Game(db.Model):
    __tablename__ = 'games'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=True)
    title = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String(255))
    description = db.Column(db.String(255))
    genre = db.Column(db.String(80))
    platform = db.Column(db.String(80))
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    # Many-to-Many Relationship
    users = db.relationship('User', secondary=user_game_association, back_populates='games')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'creator_id': self.creator_id,
            'title': self.title,
            'image': self.image,
            'description': self.description,
            'genre': self.genre,
            'platform': self.platform,
            'price': self.price,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'users': [user.to_dict() for user in self.users]  # Include related users
        }

