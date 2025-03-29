import pandas as pd
import os
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import process
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
# import nltk
# nltk.download('punkt')

# Define CSV path
CSV_PATH = 'C:/Users/91702/Documents/programming/projects/thired_year_project/IndianArtMate_project_sem5/IndianArtMate-2.O/env/datasets/NLP.csv'

# Initialize vectorizer
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = None
data = None
lemmatizer = WordNetLemmatizer()

def load_data():
    """Loads data from CSV and updates the TF-IDF matrix."""
    global data, tfidf_matrix, vectorizer

    if not os.path.exists(CSV_PATH):
        data = pd.DataFrame(columns=['_id', 'userId', 'image', 'title', 'like', 'disLike', 'description', 'category', 'price'])
    else:
        data = pd.read_csv(CSV_PATH)

    if 'title' not in data.columns or 'description' not in data.columns:
        raise ValueError("Dataset must contain 'title' and 'description' columns.")

    # Fill missing values and preprocess text
    combined_text = (
        data['title'].fillna('') + ' ' +
        data['description'].fillna('') + ' ' +
        data['category'].fillna('') + ' ' +
        data['price'].fillna('').astype(str)
    ).apply(preprocess_text)

    tfidf_matrix = vectorizer.fit_transform(combined_text)

def preprocess_text(text):
    """Preprocesses text (lowercasing, removing stopwords, lemmatization)."""
    text = text.lower()
    words = word_tokenize(text)
    words = [lemmatizer.lemmatize(word) for word in words if word.isalnum()]
    return " ".join(words)

def correct_spelling(text):
    """Corrects spelling in the input text."""
    return str(TextBlob(text).correct())
    return text

def extract_price_condition(input_text):
    """Extracts price condition from input text."""
    input_text = input_text.lower()
    price_condition = None
    min_price, max_price = None, None

    patterns = [
        (r'under\s*(\d+)', 'under'),
        (r'above\s*(\d+)', 'above'),
        (r'starting from\s*(\d+)', 'above'),
        (r'between\s*(\d+)\s*to\s*(\d+)', 'between')
    ]

    for pattern, condition in patterns:
        match = re.search(pattern, input_text)
        if match:
            price_condition = condition
            min_price = int(match.group(1)) if condition != 'under' else None
            max_price = int(match.group(1)) if condition != 'above' else int(match.group(2))
            break

    return price_condition, min_price, max_price

def find_best_matches_tfidf(input_text, top_n=10):
    """Finds the top N most relevant posts based on TF-IDF similarity, fuzzy matching, and price filtering."""
    global tfidf_matrix, vectorizer, data

    if tfidf_matrix is None or data is None:
        load_data()

    # Correct spelling and preprocess input
    input_text = preprocess_text(correct_spelling(input_text))
    print("correct:"+input_text)

    # Extract price condition
    price_condition, min_price, max_price = extract_price_condition(input_text)

    # TF-IDF Similarity
    input_tfidf = vectorizer.transform([input_text])
    cosine_similarities = cosine_similarity(input_tfidf, tfidf_matrix).flatten()
    best_indices = cosine_similarities.argsort()[-top_n:][::-1]

    results = data.iloc[best_indices].copy()

    # Convert price column to numeric safely
    results['price'] = pd.to_numeric(results['price'], errors='coerce')

    # Fuzzy Matching for Title
    results['title_match'] = results['title'].apply(lambda title: process.extractOne(input_text, [title])[1] if title else 0)
    results = results.sort_values(by=['title_match', 'price'], ascending=[False, True])

    # Apply price-based filtering
    if price_condition == 'under' and max_price is not None:
        results = results[results['price'] <= max_price]
    elif price_condition == 'above' and min_price is not None:
        results = results[results['price'] >= min_price]
    elif price_condition == 'between' and min_price is not None and max_price is not None:
        results = results[(results['price'] >= min_price) & (results['price'] <= max_price)]

    return results.drop(columns=['title_match']).to_dict(orient='records')

# def add_data_to_csv(new_data):
#     """Appends new data to CSV and updates the NLP model dynamically."""
#     global data, tfidf_matrix

#     try:
#         existing_data = pd.read_csv(CSV_PATH)
#     except FileNotFoundError:
#         existing_data = pd.DataFrame(columns=['_id', 'userId', 'image', 'title', 'like', 'disLike', 'description', 'category', 'price'])

#     new_entry = pd.DataFrame([new_data])
#     new_entry = new_entry[['_id', 'userId', 'image', 'title', 'like', 'disLike', 'description', 'category', 'price']]

#     updated_data = pd.concat([existing_data, new_entry], ignore_index=True)
#     updated_data.to_csv(CSV_PATH, index=False)

#     # Update TF-IDF Matrix incrementally
#     new_text = preprocess_text(new_data['title'] + ' ' + new_data['description'] + ' ' + new_data['category'] + ' ' + str(new_data['price']))
#     new_vector = vectorizer.transform([new_text])

#     if tfidf_matrix is None:
#         tfidf_matrix = new_vector
#     else:
#         tfidf_matrix = np.vstack([tfidf_matrix.toarray(), new_vector.toarray()])

#     data = updated_data 



def add_data_to_csv(new_data):
    """Appends new data to CSV and updates the NLP model dynamically."""
    global data, tfidf_matrix, vectorizer

    try:
        existing_data = pd.read_csv(CSV_PATH)
    except FileNotFoundError:
        existing_data = pd.DataFrame(columns=['_id', 'userId', 'image', 'title', 'like', 'disLike', 'description', 'category', 'price'])

    new_entry = pd.DataFrame([new_data])
    new_entry = new_entry[['_id', 'userId', 'image', 'title', 'like', 'disLike', 'description', 'category', 'price']]

    updated_data = pd.concat([existing_data, new_entry], ignore_index=True)
    updated_data.to_csv(CSV_PATH, index=False)

    # Recompute TF-IDF for the entire dataset
    combined_text = (
        updated_data['title'].fillna('') + ' ' +
        updated_data['description'].fillna('') + ' ' +
        updated_data['category'].fillna('') + ' ' +
        updated_data['price'].fillna('').astype(str)
    ).apply(preprocess_text)

    tfidf_matrix = vectorizer.fit_transform(combined_text)

    data = updated_data  # Update dataset reference


print("started....")


def delete_post_by_id(post_id):
    global data, tfidf_matrix

    try:
        existing_data = pd.read_csv(CSV_PATH)
    except FileNotFoundError:
        print("No data to delete.")
        return False

    if post_id not in existing_data['_id'].astype(str).values:
        return False  # Post not found

    updated_data = existing_data[existing_data['_id'] != post_id]
    updated_data.to_csv(CSV_PATH, index=False)

    # Update TF-IDF Matrix only if there are remaining records
    if not updated_data.empty:
        tfidf_matrix = vectorizer.fit_transform(updated_data.apply(
            lambda row: preprocess_text(row['title'] + ' ' + row['description'] + ' ' +
                                        row['category'] + ' ' + str(row['price'])), axis=1))
    else:
        tfidf_matrix = None  # No data left

    data = updated_data  # Update dataset reference
    return True