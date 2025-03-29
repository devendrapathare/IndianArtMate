import csv
from pymongo import MongoClient

mongo_uri = "mongodb://localhost:27017/"  
db_name = "Indian_ArtMate"  
collection_name = "userposts"  

client = MongoClient(mongo_uri)
db = client[db_name]
collection = db[collection_name]

# Fetch all data from the collection
data = collection.find()

# Create a CSV file to write the data
csv_filename = "search_data.csv"

# Open a CSV file to write
with open(csv_filename, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)

    # Get the first document to extract the field names (keys) for the CSV header
    first_document = next(data, None)  # Get the first document
    if first_document is not None:
        header = first_document.keys()  # Field names for CSV header
        writer.writerow(header)  # Write header row

        # Write each document to the CSV
        data.rewind()  # Rewind the cursor to read documents again
        for document in data:
            # For each document, ensure it has the same fields as the header (optional)
            row = [document.get(field, "") for field in header]
            writer.writerow(row)

print(f"Data from MongoDB collection '{collection_name}' has been written to {csv_filename}")
