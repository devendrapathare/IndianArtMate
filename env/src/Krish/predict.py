import pickle
import pandas as pd
import os
import sys
import logging
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

        # Convert text into vector
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

def calculate_sentiment_ratio(post_id):
    try:
        csv_path = os.path.join(CSV_DIR, f"{post_id}_predictions.csv")
        if not os.path.isfile(csv_path):
            return {"positive": 0, "negative": 0, "ratio": "N/A", "rank": "N/A"}

        df = pd.read_csv(csv_path)
        positive_count = df[df["label"] == 1].shape[0]
        negative_count = df[df["label"] == 0].shape[0]

        ratio = "Infinity" if negative_count == 0 else round(positive_count / negative_count, 2)
        rank = 5 if ratio == "Infinity" else round(min(5, max(1, 1 + 4 * (ratio / (ratio + 1)))), 2)

        return {"positive": positive_count, "negative": negative_count, "ratio": ratio, "rank": rank}

    except Exception as e:
        logging.error(f"Error calculating sentiment ratio: {e}")
        return {"positive": 0, "negative": 0, "ratio": "N/A", "rank": "N/A"}

if __name__ == "__main__":
    if len(sys.argv) > 2:
        comment = sys.argv[1]
        post_id = sys.argv[2]
        sentiment_label = predict_sentiment(comment)

        if sentiment_label is not None:
            save_prediction_to_csv(comment, sentiment_label, post_id)
            print(f"Predicted Sentiment: {'Positive' if sentiment_label == 1 else 'Negative'}")
            print("✅ Prediction saved to CSV!")
        else:
            print("❌ Prediction failed!")

    else:
        while True:
            comment = input("Enter a comment (or type 'exit' to quit): ")
            if comment.lower() == "exit":
                break

            post_id = input("Enter post ID: ")
            sentiment_label = predict_sentiment(comment)

            if sentiment_label is not None:
                print(f"Predicted Sentiment: {'Positive' if sentiment_label == 1 else 'Negative'}")
                save_prediction_to_csv(comment, sentiment_label, post_id)
                print("✅ Prediction saved to CSV!")

            # Optional data preprocessing and model training
            cleaned_path = os.path.join("CSV", f"cleaned_{post_id}_predictions.csv")
            try:
                df = load_and_preprocess_data(os.path.join(CSV_DIR, f"{post_id}_predictions.csv"))
                df.to_csv(cleaned_path, index=False)
                print("✅ Data loaded and preprocessed!")
            except Exception as e:
                logging.error(f"Error during data preprocessing: {e}")