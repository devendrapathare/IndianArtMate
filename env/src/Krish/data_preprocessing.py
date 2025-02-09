import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

nltk.download('stopwords')
nltk.download('punkt_tab')
nltk.download('wordnet')

def preprocess_text(text):

    if not isinstance(text, str):
        return ''
    
    text = re.sub(r'\d+(\.\d+)?', '', text) 
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stopwords.words('english')]
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    # print("Text preprocessed!")
    return ' '.join(tokens)

def load_and_preprocess_data(file_path):
    df = pd.read_csv(file_path)
    # columns_to_remove = ['2401', 'Borderlands']  
    # df.drop(columns=columns_to_remove, inplace=True)
    df['text'] = df['text'].apply(preprocess_text)
    print("Data loaded and preprocessed!")
    return df

if __name__ == "__main__":
    print("Preprocessing data...")
    df = load_and_preprocess_data(f"env/src/Krish/CSV/Train.csv")
    df.to_csv(f"env/src/Krish/CSV/cleaned_training.csv", index=False)
    print("Data preprocessing complete!")