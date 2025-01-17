from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Screenshot

screenshot_routes = Blueprint('screenshots', __name__)


@screenshot_routes.route('/')
def screenshots():
    """
    Query for all screenshots and returns them in a list of screenshot dictionaries
    """
    screenshots = Screenshot.query.all()
    return {'screenshots': [screenshot.to_dict() for screenshot in screenshots]}


@screenshot_routes.route('/<int:id>')
@login_required
def screenshot(id):
    """
    Query for a screenshot by id and returns that screenshot in a dictionary
    """
    screenshot = Screenshot.query.get(id)
    return screenshot.to_dict()