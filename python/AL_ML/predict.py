import pickle
import pandas as pd
import os
import sys
import logging
from flask import Flask, request, jsonify
from data_preprocessing import load_and_preprocess_data
from vectorization import vectorize_text
from model_training import train_or_update_model


# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Set default encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Dynamic path resolution
BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "Models")
CSV_DIR = os.path.join(BASE_DIR, "CSV", "PostCommentCSV")

# Ensure CSV directory exists
os.makedirs(CSV_DIR, exist_ok=True)

def predict_sentiment(text):
    try:
        with open(os.path.join(MODEL_DIR, "vectorizer_train.pkl"), "rb") as vec_file:
            vectorizer = pickle.load(vec_file)

        with open(os.path.join(MODEL_DIR, "Sentiment_train_model.pkl"), "rb") as model_file:
            model = pickle.load(model_file)

        text_vectorized = vectorizer.transform([text])
        prediction = model.predict(text_vectorized)

        return 1 if prediction[0] == 1 else 0

    except Exception as e:
        logging.error(f"Error predicting sentiment: {e}")
        return None

def save_prediction_to_csv(text, sentiment_label, post_id):
    try:
        csv_path = os.path.join(CSV_DIR, f"{post_id}_predictions.csv")
        file_exists = os.path.isfile(csv_path)

        df = pd.DataFrame([[text, sentiment_label]], columns=["text", "label"])
        df.to_csv(csv_path, mode="a", header=not file_exists, index=False, encoding='utf-8')

    except Exception as e:
        logging.error(f"Error saving prediction to CSV: {e}")

def calculate_sentiment_ratio(text, post_id):
    print("Calculating sentiment ratio...")
    try:
        sentiment_label = predict_sentiment(text)
        if sentiment_label is not None:
            save_prediction_to_csv(text, sentiment_label, post_id)

        csv_path = os.path.join(CSV_DIR, f"{post_id}_predictions.csv")
        if not os.path.isfile(csv_path):
            return {"positive": 0, "negative": 0, "ratio": "N/A", "rank": "N/A"}

        df = pd.read_csv(csv_path)
        positive_count = df[df["label"] == 1].shape[0]
        negative_count = df[df["label"] == 0].shape[0]

        ratio = "Infinity" if negative_count == 0 else round(positive_count / negative_count, 2)
        rank = 5 if ratio == "Infinity" else round(min(5, max(1, 1 + 4 * (ratio / (ratio + 1)))), 2)

        print(f"Positive Count: {positive_count}, Negative Count: {negative_count}, Ratio: {ratio}, Rank: {rank}")

        return {"positive": positive_count, "negative": negative_count, "ratio": ratio, "rank": rank}
    
    except Exception as e:
        logging.error(f"Error calculating sentiment ratio: {e}")
        return {"positive": 0, "negative": 0, "ratio": "N/A", "rank": "N/A"}

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "")
    post_id = data.get("post_id", "")
    if not text or not post_id:
        return jsonify({"error": "Missing text or post_id"}), 400

    result = calculate_sentiment_ratio(text, post_id)
    return jsonify(result)


