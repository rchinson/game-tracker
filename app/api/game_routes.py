from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Game

game_routes = Blueprint('games', __name__)


@game_routes.route('/')
def games():
    """
    Query for all games and returns them in a list of game dictionaries
    """
    games = Game.query.all()
    return {'games': [game.to_dict() for game in games]}


@game_routes.route('/<int:id>')
@login_required
def game(id):
    """
    Query for a game by id and returns that game in a dictionary
    """
    game = Game.query.get(id)
    return game.to_dict()
