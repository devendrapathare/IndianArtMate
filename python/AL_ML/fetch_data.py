from db_connection import get_database

def fetch_data():
    db = get_database()
    collection = db["comments"]
    data = list(collection.find())  
    return data
