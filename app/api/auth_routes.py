import os
import requests

from flask import Blueprint, request, redirect, url_for, session, jsonify
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash

auth_routes = Blueprint('auth', __name__)



STEAM_API_KEY = os.getenv("STEAM_API_KEY")
STEAM_OPENID_URL = "https://steamcommunity.com/openid/login"

def get_steam_auth_url():
    """ Generates the Steam OpenID authentication URL """
    return (
        f"{STEAM_OPENID_URL}?"
        f"openid.ns=http://specs.openid.net/auth/2.0&"
        f"openid.mode=checkid_setup&"
        f"openid.return_to={url_for('auth.steam_callback', _external=True)}&"
        f"openid.realm={request.host_url}&"
        f"openid.identity=http://specs.openid.net/auth/2.0/identifier_select&"
        f"openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select"
    )

@auth_routes.route('/steam-login')
def steam_login():
    """ Redirects users to Steam's OpenID authentication """
    return redirect(get_steam_auth_url())

@auth_routes.route('/steam-callback')
def steam_callback():
    """ Handles the Steam authentication callback """
    args = request.args.to_dict()
    steam_id = None

    if "openid.claimed_id" in args:
        steam_id = args["openid.claimed_id"].split("/")[-1]

    if not steam_id:
        return jsonify({"error": "Steam authentication failed"}), 401

    # Fetch user details from Steam API
    steam_user_data = get_steam_user_data(steam_id)

    if not steam_user_data:
        return jsonify({"error": "Failed to fetch Steam user data"}), 500

    # Check if the user exists, if not create one
    user = User.query.filter_by(steam_id=steam_id).first()
    if not user:
        user = User(
            username=steam_user_data["personaname"],
            email=f"steam_{steam_id}@steam.com",  # Dummy email, Steam does not provide email
            password = generate_password_hash(f'{steam_id}'),
            avatar=steam_user_data["avatarfull"],
            steam_id=steam_id
        )
        db.session.add(user)
        db.session.commit()

    # Log the user in
    login_user(user)

    return redirect(url_for("auth.authenticate"))

def get_steam_user_data(steam_id):
    """ Fetches user data from Steam API """
    steam_api_url = f"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key={STEAM_API_KEY}&steamids={steam_id}"
    response = requests.get(steam_api_url)
    
    if response.status_code == 200:
        data = response.json()
        if "response" in data and "players" in data["response"] and len(data["response"]["players"]) > 0:
            return data["response"]["players"][0]
    
    return None




@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return form.errors, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return form.errors, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401