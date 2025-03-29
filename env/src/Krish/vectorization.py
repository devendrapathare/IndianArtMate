import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle

def load_vectorizer():
    try:
        with open(f"env/src/Krish/Models/vectorizer_train.pkl", "rb") as vec_file:
            vectorizer = pickle.load(vec_file)
        print("✅ Loaded existing vectorizer!")
    except FileNotFoundError:
        print("⚠️ Vectorizer not found, creating a new one!")
        vectorizer = TfidfVectorizer(max_features=20000)
    
    return vectorizer

def vectorize_text(file_path):
    df = pd.read_csv(file_path)
    df = df.dropna(subset=['text'])

    vectorizer = load_vectorizer()
    X = vectorizer.fit_transform(df['text'])

    with open(f"env/src/Krish/Models/vectorizer_train.pkl", "wb") as vec_file:
        pickle.dump(vectorizer, vec_file)

    print("✅ Text vectorized successfully!")
    return X, df['label']

if __name__ == "__main__":
    X, y = vectorize_text(f"env/src/Krish/CSV/cleaned_training.csv")
