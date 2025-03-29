import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

def load_model_and_vectorizer():
    try:
        with open(f"env/src/Krish/Models/vectorizer_train.pkl", "rb") as vec_file:
            vectorizer = pickle.load(vec_file)

        with open(f"env/src/Krish/Models/Sentiment_train_model.pkl", "rb") as model_file:
            model = pickle.load(model_file)
        
        print("✅ Model and vectorizer loaded successfully!")
    except FileNotFoundError:
        print("⚠️ Model or vectorizer not found! Training a new model...")
        vectorizer = None
        model = LogisticRegression()
    
    return model, vectorizer

def train_or_update_model(file_path, is_incremental=False):
    df = pd.read_csv(file_path)
    df = df.dropna(subset=['text'])

    # ✅ Existing model aur vectorizer load karna
    model, vectorizer = load_model_and_vectorizer()

    if vectorizer is None:
        from sklearn.feature_extraction.text import TfidfVectorizer
        vectorizer = TfidfVectorizer(max_features=20000)
        X = vectorizer.fit_transform(df["text"])
        with open(f"env/src/Krish/Models/vectorizer_train.pkl", "wb") as vec_file:
            pickle.dump(vectorizer, vec_file)
    else:
        X = vectorizer.transform(df["text"])
    
    y = df["label"]

    # ✅ Train or update model
    if is_incremental:
        print("🔄 Updating model with new data...")
        model.partial_fit(X, y, classes=[0, 1])  # 🔹 Incremental learning
    else:
        print("🚀 Training new model...")
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model.fit(X_train, y_train)

        # ✅ Evaluate model accuracy
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"✅ Model trained with accuracy: {accuracy * 100:.2f}%")

    # ✅ Save the updated model
    with open(f"env/src/Krish/Models/Sentiment_train_model.pkl", "wb") as model_file:
        pickle.dump(model, model_file)

    print("✅ Model saved successfully!")

if __name__ == "__main__":
    train_or_update_model(f"env/src/Krish/CSV/cleaned_training.csv", is_incremental=False)  # 🆕 Full training
    # train_or_update_model(f"env/src/Krish/CSV/Output_67a38f22644da7bec8c06050.csv", is_incremental=True)  # 🆕 Incremental learning
