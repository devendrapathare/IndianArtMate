import pymongo

def get_database():
    MONGO_URI = "mongodb://localhost:27017/"
    client = pymongo.MongoClient(MONGO_URI)
    db = client["Indian_ArtMate"]
    return db
