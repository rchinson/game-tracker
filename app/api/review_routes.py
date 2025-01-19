from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Review, Game

review_routes = Blueprint('reviews', __name__)

@review_routes.route('/')
def get_reviews():
    """
    Get all reviews.
    """
    reviews = Review.query.all()
    return {'reviews': [review.to_dict() for review in reviews]}

@review_routes.route('/<int:id>')
def get_review(id):
    """
    Get a review by id.
    """
    review = Review.query.get(id)
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    return review.to_dict()

@review_routes.route('/', methods=['POST'])
@login_required
def create_review():
    """
    Create a new review.
    """
    data = request.get_json()
    game = Game.query.get(data.get('game_id'))
    if not game:
        return jsonify({'error': 'Game not found'}), 404

    new_review = Review(
        user_id=current_user.id,
        game_id=data.get('game_id'),
        title=data.get('title'),
        body=data.get('body'),
        starRating=data.get('starRating')
    )
    db.session.add(new_review)
    db.session.commit()
    return new_review.to_dict(), 201

@review_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_review(id):
    """
    Update an existing review.
    """
    review = Review.query.get(id)
    if not review:
        return jsonify({'error': 'Review not found'}), 404

    if review.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    review.title = data.get('title', review.title)
    review.body = data.get('body', review.body)
    review.starRating = data.get('starRating', review.starRating)

    db.session.commit()
    return review.to_dict()

@review_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_review(id):
    """
    Delete an existing review.
    """
    review = Review.query.get(id)
    if not review:
        return jsonify({'error': 'Review not found'}), 404

    if review.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review successfully deleted'}), 200
