import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load dataset
data = pd.read_csv('env/datasets/search_data.csv')

# Ensure dataset has required columns
if 'title' not in data.columns or 'description' not in data.columns:
    raise ValueError("Dataset must contain 'title' and 'description' columns.")

# Initialize vectorizer and compute TF-IDF matrix
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(data['title'].fillna('') + ' ' + data['description'].fillna(''))

def find_best_matches_tfidf(input_text, top_n=5):
    """Finds the top N most similar items based on TF-IDF similarity."""
    input_tfidf = vectorizer.transform([input_text])
    cosine_similarities = cosine_similarity(input_tfidf, tfidf_matrix).flatten()
    best_indices = cosine_similarities.argsort()[-top_n:][::-1]  

    results = data.iloc[best_indices]  

    if isinstance(results, pd.Series):  
        results = results.to_frame().T

    return results.to_dict(orient='records')  

@app.route('/search', methods=['GET'])
def search():
    """Handles the search request from the user."""
    input_text = request.args.get('input_text', '')  
    if not input_text:
        return jsonify({'error': 'input_text is required'}), 400

    matches = find_best_matches_tfidf(input_text)

    response = {
        "status": "success",
        "query": input_text,
        "results": matches
    }

    return jsonify(response)  

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=6000, debug=True)
