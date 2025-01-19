from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Screenshot, Game

screenshot_routes = Blueprint('screenshots', __name__)

@screenshot_routes.route('/')
def get_screenshots():
    """
    Get all screenshots.
    """
    screenshots = Screenshot.query.all()
    return {'screenshots': [screenshot.to_dict() for screenshot in screenshots]}

@screenshot_routes.route('/<int:id>')
def get_screenshot(id):
    """
    Get a screenshot by id.
    """
    screenshot = Screenshot.query.get(id)
    if not screenshot:
        return jsonify({'error': 'Screenshot not found'}), 404
    return screenshot.to_dict()

@screenshot_routes.route('/', methods=['POST'])
@login_required
def create_screenshot():
    """
    Create a new screenshot.
    """
    data = request.get_json()
    game = Game.query.get(data.get('game_id'))
    if not game:
        return jsonify({'error': 'Game not found'}), 404

    new_screenshot = Screenshot(
        user_id=current_user.id,
        game_id=data.get('game_id'),
        image_url=data.get('image_url'),
        description=data.get('description')
    )
    db.session.add(new_screenshot)
    db.session.commit()
    return new_screenshot.to_dict(), 201

@screenshot_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_screenshot(id):
    """
    Update an existing screenshot.
    """
    screenshot = Screenshot.query.get(id)
    if not screenshot:
        return jsonify({'error': 'Screenshot not found'}), 404

    if screenshot.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    screenshot.image_url = data.get('image_url', screenshot.image_url)
    screenshot.description = data.get('description', screenshot.description)

    db.session.commit()
    return screenshot.to_dict()

@screenshot_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_screenshot(id):
    """
    Delete an existing screenshot.
    """
    screenshot = Screenshot.query.get(id)
    if not screenshot:
        return jsonify({'error': 'Screenshot not found'}), 404

    if screenshot.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(screenshot)
    db.session.commit()
    return jsonify({'message': 'Screenshot successfully deleted'}), 200
