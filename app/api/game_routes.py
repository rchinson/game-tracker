from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Game

game_routes = Blueprint('games', __name__)

@game_routes.route('/')
def get_games():
    """
    Get all games.
    """
    games = Game.query.all()
    return {'games': [game.to_dict() for game in games]}

@game_routes.route('/<int:id>')
def get_game(id):
    """
    Get a game by id.
    """
    game = Game.query.get(id)
    if not game:
        return jsonify({'error': 'Game not found'}), 404
    return game.to_dict()

@game_routes.route('/', methods=['POST'])
@login_required
def create_game():
    """
    Create a new game.
    """
    data = request.get_json()
    new_game = Game(
        creator_id=current_user.id,
        title=data.get('title'),
        image=data.get('image'),
        description=data.get('description'),
        genre=data.get('genre'),
        platform=data.get('platform'),
        price=data.get('price')
    )
    db.session.add(new_game)
    db.session.commit()
    return new_game.to_dict(), 201

@game_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_game(id):
    """
    Update an existing game.
    """
    game = Game.query.get(id)
    if not game:
        return jsonify({'error': 'Game not found'}), 404

    if game.creator_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    game.title = data.get('title', game.title)
    game.image = data.get('image', game.image)
    game.description = data.get('description', game.description)
    game.genre = data.get('genre', game.genre)
    game.platform = data.get('platform', game.platform)
    game.price = data.get('price', game.price)

    db.session.commit()
    return game.to_dict()

@game_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_game(id):
    """
    Delete an existing game.
    """
    game = Game.query.get(id)
    if not game:
        return jsonify({'error': 'Game not found'}), 404

    if game.creator_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(game)
    db.session.commit()
    return jsonify({'message': 'Game successfully deleted'}), 200
