from flask import Blueprint, request, jsonify
from predict import calculate_sentiment_ratio  
from bson.objectid import ObjectId

sentiment_bp = Blueprint("sentiment", __name__)

@sentiment_bp.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "")
    post_id = data.get("post_id", "")

    if not text or not post_id:
        return jsonify({"error": "Missing text or post_id"}), 400

    result = calculate_sentiment_ratio(text, post_id)
    return jsonify(result)

