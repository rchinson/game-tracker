from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Game

user_game_routes = Blueprint('user_games', __name__)

@user_game_routes.route('/<int:user_id>/games', methods=['GET'])
def get_user_games(user_id):
    """
    Get all the games for a user.
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return {'games': [game.to_dict() for game in user.games]}

@user_game_routes.route('/<int:game_id>/users', methods=['GET'])
def get_game_users(game_id):
    """
    Get all the users for a game.
    """
    game = Game.query.get(game_id)
    if not game:
        return jsonify({'error': 'Game not found'}), 404
    return {'users': [user.to_dict() for user in game.users]}



@user_game_routes.route('/add', methods=['POST'])
@login_required
def add_user_game():
    """
    Add a game to the current user.
    """
    data = request.get_json()
    game_id = data.get('game_id')

    game = Game.query.get(game_id)
    if not game:
        return jsonify({'error': 'Game not found'}), 404

    if game in current_user.games:
        return jsonify({'error': 'Game is already added to the user'}), 400

    current_user.games.append(game)
    db.session.commit()
    return jsonify({'message': 'Game successfully added to user', 'game': game.to_dict()}), 200

@user_game_routes.route('/remove', methods=['POST'])
@login_required
def remove_user_game():
    """
    Remove a game from the current user.
    """
    data = request.get_json()
    game_id = data.get('game_id')

    game = Game.query.get(game_id)
    if not game:
        return jsonify({'error': 'Game not found'}), 404

    if game not in current_user.games:
        return jsonify({'error': 'Game is not added to the user'}), 400

    current_user.games.remove(game)
    db.session.commit()
    return jsonify({'message': 'Game successfully removed from user', 'game': game.to_dict()}), 200
