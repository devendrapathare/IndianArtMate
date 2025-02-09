import pickle
import pandas as pd
import os
from data_preprocessing import load_and_preprocess_data
from vectorization import vectorize_text
from model_training import train_or_update_model

def predict_sentiment(text):
    # ✅ Load vectorizer aur model
    with open(f"env/src/Krish/Models/vectorizer_train.pkl", "rb") as vec_file:
        vectorizer = pickle.load(vec_file)

    with open(f"env/src/Krish/Models/Sentiment_train_model.pkl", "rb") as model_file:
        model = pickle.load(model_file)

    # ✅ Convert text into vector
    text_vectorized = vectorizer.transform([text])
    prediction = model.predict(text_vectorized)

    # ✅ Convert sentiment into 0 (Negative) / 1 (Positive)
    sentiment_label = 1 if prediction[0] == 1 else 0

    return sentiment_label

def save_prediction_to_csv(text, sentiment_label):
    csv_path = "env/src/Krish/CSV/your_predictions.csv"
    
    # ✅ Check karo agar CSV exist karta hai, tabhi header skip hoga
    file_exists = os.path.isfile(csv_path)
    
    # ✅ DataFrame banao aur CSV me append karo
    df = pd.DataFrame([[text, sentiment_label]], columns=["text", "label"])
    df.to_csv(csv_path, mode="a", header=not file_exists, index=False)

if __name__ == "__main__":
    while True:
        comment = input("Enter a comment (or type 'exit' to quit): ")
        if comment.lower() == "exit":
            break
        sentiment_label = predict_sentiment(comment)
        print(f"Predicted Sentiment: {'Positive' if sentiment_label == 1 else 'Negative'}")

        # ✅ Save input text and sentiment in CSV
        save_prediction_to_csv(comment, sentiment_label)
        print("✅ Prediction saved to CSV!")

        df = load_and_preprocess_data("env/src/Krish/CSV/your_predictions.csv")
        df.to_csv("env/src/Krish/CSV/cleaned_your_predictions.csv", index=False)
        print("Data loaded and preprocessed!")
 
        # X, y = vectorize_text(f"env/src/Krish/CSV/cleaned_your_predictions.csv")
        # print("Data vectorized successfully!")

        # train_or_update_model(f"env/src/Krish/CSV/cleaned_your_predictions.csv", is_incremental=True)
        # print("Model updated with new data!")