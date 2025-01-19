from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User
from werkzeug.security import generate_password_hash

user_routes = Blueprint('users', __name__)

@user_routes.route('/')
def get_users():
    """
    Get all users.
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/<int:id>')
def get_user(id):
    """
    Get a user by id.
    """
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return user.to_dict()

@user_routes.route('/', methods=['POST'])
def create_user():
    """
    Create a new user.
    """
    data = request.get_json()

    # Check if email or username already exists
    if User.query.filter(User.email == data.get('email')).first():
        return jsonify({'error': 'Email is already in use.'}), 400
    if User.query.filter(User.username == data.get('username')).first():
        return jsonify({'error': 'Username is already in use.'}), 400

    new_user = User(
        username=data.get('username'),
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        password=generate_password_hash(data.get('password')),
        avatar=data.get('avatar'),
        about_me=data.get('about_me')
    )
    db.session.add(new_user)
    db.session.commit()
    return new_user.to_dict(), 201

@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_user(id):
    """
    Update an existing user.
    """
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if user.id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    user.username = data.get('username', user.username)
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.email = data.get('email', user.email)
    if data.get('password'):
        user.password = generate_password_hash(data.get('password'))
    user.avatar = data.get('avatar', user.avatar)
    user.about_me = data.get('about_me', user.about_me)

    db.session.commit()
    return user.to_dict()

@user_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_user(id):
    """
    Delete an existing user.
    """
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if user.id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User successfully deleted'}), 200
