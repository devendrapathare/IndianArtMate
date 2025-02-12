import pickle
import pandas as pd
import os
import sys
from data_preprocessing import load_and_preprocess_data
from vectorization import vectorize_text
from model_training import train_or_update_model

def predict_sentiment(text):
    # ✅ Load vectorizer aur model
    model_dir = os.path.join(os.path.dirname(__file__), "Models")
    with open(os.path.join(model_dir, "vectorizer_train.pkl"), "rb") as vec_file:
        vectorizer = pickle.load(vec_file)

    with open(os.path.join(model_dir, "Sentiment_train_model.pkl"), "rb") as model_file:
        model = pickle.load(model_file)

    # ✅ Convert text into vector
    text_vectorized = vectorizer.transform([text])
    prediction = model.predict(text_vectorized)

    # ✅ Convert sentiment into 0 (Negative) / 1 (Positive)
    sentiment_label = 1 if prediction[0] == 1 else 0

    return sentiment_label

def save_prediction_to_csv(text, sentiment_label, post_id):
    csv_dir = os.path.join(os.path.dirname(__file__), "CSV", "PostCommentCSV")
    csv_path = os.path.join(csv_dir, f"{post_id}_predictions.csv")
    
    # ✅ Check karo agar CSV exist karta hai, tabhi header skip hoga
    file_exists = os.path.isfile(csv_path)
    
    # ✅ DataFrame banao aur CSV me append karo
    df = pd.DataFrame([[text, sentiment_label]], columns=["text", "label"])
    df.to_csv(csv_path, mode="a", header=not file_exists, index=False)

def calculate_sentiment_ratio(post_id):
    csv_dir = os.path.join(os.path.dirname(__file__), "CSV", "PostCommentCSV")
    csv_path = os.path.join(csv_dir, f"{post_id}_predictions.csv")
    
    if not os.path.isfile(csv_path):
        return {"positive": 0, "negative": 0, "ratio": "N/A", "rank": "N/A"}
    
    df = pd.read_csv(csv_path)
    positive_count = df[df["label"] == 1].shape[0]
    negative_count = df[df["label"] == 0].shape[0]
    
    if negative_count == 0:
        ratio = "Infinity"
    else:
        ratio = positive_count / negative_count
    
    # Calculate rank out of 5 based on the ratio
    if ratio == "Infinity":
        rank = 5
    else:
        rank = min(5, max(1, 1 + 4 * (ratio / (ratio + 1))))
    
    # Format rank to two decimal places
    rank = round(rank, 2)
    
    return {"positive": positive_count, "negative": negative_count, "ratio": ratio, "rank": rank}

if __name__ == "__main__":
    if len(sys.argv) > 2:
        comment = sys.argv[1]
        post_id = sys.argv[2]
        sentiment_label = predict_sentiment(comment)
        save_prediction_to_csv(comment, sentiment_label, post_id)
        print(f"Predicted Sentiment: {'Positive' if sentiment_label == 1 else 'Negative'}")
        print("✅ Prediction saved to CSV!!")
    else:
        while True:
            comment = input("Enter a comment (or type 'exit' to quit): ")
            if comment.lower() == "exit":
                break
            post_id = input("Enter post ID: ")
            sentiment_label = predict_sentiment(comment)
            print(f"Predicted Sentiment: {'Positive' if sentiment_label == 1 else 'Negative'}")
            save_prediction_to_csv(comment, sentiment_label, post_id)
            print("✅ Prediction saved to CSV!")

            df = load_and_preprocess_data(os.path.join("CSV", f"{post_id}_predictions.csv"))
            df.to_csv(os.path.join("CSV", f"cleaned_{post_id}_predictions.csv"), index=False)
            print("Data loaded and preprocessed!")

            # X, y = vectorize_text(os.path.join("CSV", f"cleaned_{post_id}_predictions.csv"))
            # print("Data vectorized successfully!")

            # train_or_update_model(os.path.join("CSV", f"cleaned_{post_id}_predictions.csv"), is_incremental=True)
            # print("Model updated with new data!")