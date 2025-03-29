from flask import Blueprint, jsonify
from .recommend_user import recommend_users_ml

recommend_bp = Blueprint("recommend", __name__)

@recommend_bp.route("/<user_id>")
def recommend(user_id):
    """Fetch real-time recommendations for a user."""
    recommended = recommend_users_ml(user_id)
    return jsonify({"recommended_users": recommended})
