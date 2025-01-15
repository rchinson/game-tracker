from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from .db import user_game_association
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    avatar = db.Column(db.String(255))
    about_me = db.Column(db.String(255))
    number_of_games = db.Column(db.Integer, default=0)
    number_of_reviews = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=db.func.now(), nullable=True)
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now(), nullable=True)

    # Many-to-Many Relationship
    games = db.relationship('Game', secondary=user_game_association, back_populates='users')


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'avatar': self.avatar,
            'about_me': self.about_me,
            'number_of_games': self.number_of_games,
            'number_of_reviews': self.number_of_reviews,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'games': [game.to_dict() for game in self.games]  # Include related games
        }


