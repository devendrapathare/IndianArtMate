import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import linear_kernel

data = pd.read_csv('data.csv')

vectorizer = TfidfVectorizer()
count_vectorizer = CountVectorizer()

tfidf_matrix = vectorizer.fit_transform(data['art_title'] + ' ' + data['art_desc'])
count_matrix = count_vectorizer.fit_transform(data['art_title'] + ' ' + data['art_desc'])

def find_best_matches_tfidf(input_text, top_n=5):
    input_tfidf = vectorizer.transform([input_text])
    cosine_similarities = cosine_similarity(input_tfidf, tfidf_matrix).flatten()
    best_indices = cosine_similarities.argsort()[-top_n:][::-1]
    return data.iloc[best_indices]

def find_best_matches_count(input_text, top_n=5):
    input_count = count_vectorizer.transform([input_text])
    cosine_similarities = cosine_similarity(input_count, count_matrix).flatten()
    best_indices = cosine_similarities.argsort()[-top_n:][::-1]
    return data.iloc[best_indices]

def find_best_matches_linear_kernel(input_text, top_n=5):
    input_tfidf = vectorizer.transform([input_text])
    cosine_similarities = linear_kernel(input_tfidf, tfidf_matrix).flatten()
    best_indices = cosine_similarities.argsort()[-top_n:][::-1]
    return data.iloc[best_indices]

# Example usage
if __name__ == "__main__":
    input_text = "krishna"
    tfidf_matches = find_best_matches_tfidf(input_text)
    count_matches = find_best_matches_count(input_text)
    linear_kernel_matches = find_best_matches_linear_kernel(input_text)
    print("TF-IDF Matches:")
    print(tfidf_matches)
    print("\nCount Matches:")
    print(count_matches)
    print("\nLinear Kernel Matches:")
    print(linear_kernel_matches) 

