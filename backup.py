import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from textblob import TextBlob
import os
import re


CSV_PATH = 'C:/Users/91702/Documents/programming/projects/thired_year_project/IndianArtMate_project_sem5/IndianArtMate-2.O/env/datasets/NLP.csv'

vectorizer = TfidfVectorizer()
tfidf_matrix = None
data = None

def load_data():
    """Loads data from CSV and updates the TF-IDF matrix."""
    global data, tfidf_matrix, vectorizer

    if not os.path.exists(CSV_PATH):
        data = pd.DataFrame(columns=['userId', 'image', 'title', 'description', 'category', 'price'])
    else:
        data = pd.read_csv(CSV_PATH)

    if 'title' not in data.columns or 'description' not in data.columns:
        raise ValueError("Dataset must contain 'title' and 'description' columns.")

    tfidf_matrix = vectorizer.fit_transform(data['title'].fillna('') + ' ' + data['description'].fillna('') + ' ' + data['category'].fillna('') + ' ' + str(data['price'].fillna('')))

def correct_spelling(text):
    """Corrects spelling in the input text."""
    return str(TextBlob(text).correct())




def extract_price_condition(input_text):
    """Extracts price condition from input text."""
    input_text = input_text.lower()
    price_condition = None
    min_price, max_price = None, None

    # Check for 'under X' pattern
    match = re.search(r'under\s*(\d+)', input_text)
    if match:
        price_condition = 'under'
        max_price = int(match.group(1))
    
    # Check for 'above X' pattern
    match = re.search(r'above\s*(\d+)', input_text)
    if match:
        price_condition = 'above'
        min_price = int(match.group(1))

    match = re.search(r'starting from\s*(\d+)', input_text)
    if match:
        price_condition = 'above'
        min_price = int(match.group(1))
    
    match = re.search(r'between\s*(\d+)\s*to\s*(\d+)', input_text)
    if match:
        price_condition = 'between'
        min_price = int(match.group(1))
        max_price = int(match.group(2))
    
    return price_condition, min_price, max_price

def find_best_matches_tfidf(input_text, top_n=10):
    """Finds the top N most similar items based on TF-IDF similarity and applies price filtering."""
    global tfidf_matrix, vectorizer, data

    if tfidf_matrix is None or data is None:
        load_data()

    # Extract price condition from input text
    price_condition, min_price, max_price = extract_price_condition(input_text)

    # Perform TF-IDF search
    input_tfidf = vectorizer.transform([input_text])
    cosine_similarities = cosine_similarity(input_tfidf, tfidf_matrix).flatten()
    best_indices = cosine_similarities.argsort()[-top_n:][::-1]  

    results = data.iloc[best_indices]

    # Convert price column to numeric (in case of missing values)
    results['price'] = pd.to_numeric(results['price'], errors='coerce')

    # Apply price-based filtering
    if price_condition == 'under' and max_price is not None:
        results = results[results['price'] <= max_price]
    elif price_condition == 'above' and min_price is not None:
        results = results[results['price'] >= min_price]
    elif price_condition == 'between' and min_price is not None and max_price is not None:
        results = results[(results['price'] >= min_price) & (results['price'] <= max_price)]

    return results.to_dict(orient='records')


def add_data_to_csv(new_data):
    """Appends new data to CSV and updates the NLP model dynamically."""
    global data

    try:
        existing_data = pd.read_csv(CSV_PATH)
    except FileNotFoundError:
        existing_data = pd.DataFrame(columns=['userId', 'image', 'title','like','disLike', 'description', 'category', 'price'])

    new_entry = pd.DataFrame([new_data])
    new_entry = new_entry[['_id','userId', 'image', 'title','like','disLike', 'description', 'category', 'price']]

    updated_data = pd.concat([existing_data, new_entry], ignore_index=True)
    updated_data.to_csv(CSV_PATH, index=False)

    load_data()  




