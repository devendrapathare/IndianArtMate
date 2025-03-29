from flask import Blueprint, request, jsonify
from .nlp_model import *


nlp_blueprint = Blueprint("nlp", __name__)


@nlp_blueprint.route('/post_data', methods=['POST'])
def post_data():
    """Handles adding new posts to the dataset."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    print("data",data)
    add_data_to_csv(data)
    return jsonify({'status': 'success', 'message': 'Data added successfully'}), 200


import numpy as np

@nlp_blueprint.route('/search', methods=['GET'])
def search():
    """Handles the search request from the user."""
    input_text = request.args.get('input_text', '')  
    if not input_text:
        return jsonify({'error': 'input_text is required'}), 400

    corrected_text = correct_spelling(input_text)
    print("corrected_text", corrected_text)
    matches = find_best_matches_tfidf(corrected_text)

    # Function to replace NaN with None
    def replace_nan(obj):
        if isinstance(obj, dict):
            return {k: replace_nan(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [replace_nan(v) for v in obj]
        elif isinstance(obj, float) and np.isnan(obj):
            return None
        return obj

    sanitized_matches = replace_nan(matches)

    response = {
        "status": "success",
        "original_query": input_text,
        "corrected_query": corrected_text,
        "results": sanitized_matches
    }

    return jsonify(response)



@nlp_blueprint.route('/delete', methods=['DELETE'])
def delete():
    """Handles deleting a post from the dataset."""
    post_id = request.args.get('post_id')
    if not post_id:
        return jsonify({'error': 'post_id is required'}), 400
    success = delete_post_by_id(post_id)
    if success:
        return jsonify({'status': 'success', 'message': 'Post deleted successfully'}), 200
    else:
        return jsonify({'error': 'Post not found in CSV'}), 404