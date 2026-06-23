# import numpy as np
# from sklearn.metrics.pairwise import cosine_similarity
# from pymongo import MongoClient
# import pandas as pd


# MONGO_URI = "mongodb://localhost:27017/"  
# DB_NAME = "Indian_ArtMate"  
# COLLECTION_NAME = "users"


# import pandas as pd
# from pymongo import MongoClient

# def get_users():
#     """Fetch latest respect data from MongoDB"""
#     client = MongoClient(MONGO_URI)
#     db = client[DB_NAME]
#     collection = db[COLLECTION_NAME]

#     # Fetch data from MongoDB
#     cursor = collection.find({}, {"_id": 1, "respecting": 1})  # Fetch only _id and respects
#     data_list = list(cursor)  # Convert cursor to list

#     # Convert data into a Pandas DataFrame
#     df = pd.DataFrame(data_list)

#     # Ensure _id is a string for easy processing
#     df["_id"] = df["_id"].astype(str)

#     # Convert 'respects' field to list of strings
#     df["respecting"] = df["respecting"].apply(lambda x: [str(uid) for uid in x] if isinstance(x, list) else [])

#     # Convert DataFrame into dictionary
#     users = dict(zip(df["_id"], df["respecting"]))

#     print("Processed Users Dictionary:", users)  # Debugging

#     return users


# def build_user_matrix(users):
#     """Convert user respect data into a binary matrix"""
#     all_users = list(users.keys())  # List of all users
#     matrix = np.zeros((len(all_users), len(all_users)))  # Initialize matrix

#     for i, user in enumerate(all_users):
#         for respected in users[user]:
#             if respected in all_users:
#                 matrix[i][all_users.index(respected)] = 1  # Mark respect as 1

#     print(matrix)

#     return matrix, all_users



# def recommend_users_ml(target_user):
#     users = get_users()  # Fetch latest data
#     print("Target User:", target_user)  # Print user being checked
#     print("All Users:", users.keys())  # Print all available users

#     if target_user not in users:
#         print("User NOT FOUND!")
#         return []  # Return empty if user not found

#     matrix, all_users = build_user_matrix(users)  # Build matrix dynamically
#     user_idx = all_users.index(target_user)  # Find user index
#     similarities = cosine_similarity(matrix)[user_idx]  # Compute similarities

#     ranked_users = np.argsort(similarities)[::-1]  # Sort users by similarity
#     return [all_users[i] for i in ranked_users if i != user_idx][:5]  # Top 5




import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
import pandas as pd

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "Indian_ArtMate2"
COLLECTION_NAME = "users"

def get_users():
    """Fetch latest respect data from MongoDB"""
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]

    # Fetch user ID and respecting array
    cursor = collection.find({}, {"_id": 1, "respecting": 1})
    data_list = list(cursor)

    # Convert into DataFrame
    df = pd.DataFrame(data_list)
    df["_id"] = df["_id"].astype(str)
    df["respecting"] = df["respecting"].apply(lambda x: [str(uid) for uid in x] if isinstance(x, list) else [])

    # Convert to dictionary format
    users = dict(zip(df["_id"], df["respecting"]))
    return users

def build_user_matrix(users):
    """Convert respect data into a binary matrix"""
    all_users = list(users.keys())
    user_count = len(all_users)
    matrix = np.zeros((user_count, user_count))

    # Build matrix
    for i, user in enumerate(all_users):
        for respected in users[user]:
            if respected in all_users:
                j = all_users.index(respected)
                matrix[i][j] = 1  # Mark respect relationship

    return matrix, all_users

def jaccard_similarity(matrix):
    """Compute Jaccard similarity to enhance recommendation accuracy"""
    intersection = np.dot(matrix, matrix.T)
    row_sums = matrix.sum(axis=1)
    union = row_sums[:, None] + row_sums - intersection
    return np.divide(intersection, union, out=np.zeros_like(intersection), where=union != 0)

def recommend_users_ml(target_user):
    users = get_users()
    if target_user not in users:
        return []

    matrix, all_users = build_user_matrix(users)
    user_idx = all_users.index(target_user)

    # Compute similarities using both Cosine and Jaccard
    cosine_sim = cosine_similarity(matrix)[user_idx]
    jaccard_sim = jaccard_similarity(matrix)[user_idx]

    # Combined score (weighting cosine higher)
    combined_score = 0.7 * cosine_sim + 0.3 * jaccard_sim

    ranked_users = np.argsort(combined_score)[::-1]
    
    # Recommend top 5 excluding the user itself
    return [all_users[i] for i in ranked_users if i != user_idx][:5]
