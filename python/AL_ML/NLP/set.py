import pandas as pd
from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "Indian_ArtMate"
COLLECTION_NAME = "userposts"

# Fixed CSV file path
CSV_PATH = r"C:\Users\91702\Documents\programming\projects\thired_year_project\comp\python\AL_ML\NLP\NLP.csv"

def fetch_mongo_data():
    """Fetch data from MongoDB and convert it to a DataFrame."""
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]

    # Fetch all documents while excluding `_id`, `createdAt`, `updatedAt`, and `__v`
    cursor = collection.find({}, {"comments":0, "createdAt": 0, "updatedAt": 0, "__v": 0})

    # Convert to a list of dictionaries
    data_list = list(cursor)

    # Convert to DataFrame
    df = pd.DataFrame(data_list)

    return df

def save_to_csv():
    """Fetch data from MongoDB and save it as a CSV file."""
    df = fetch_mongo_data()

    # Save to CSV
    df.to_csv(CSV_PATH, index=False)
    print(f"CSV file saved successfully at {CSV_PATH}")

# Run the script
if __name__ == "__main__":
    print(save_to_csv())
