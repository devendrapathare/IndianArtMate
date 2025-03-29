import pandas as pd
from fetch_data import fetch_data

def convert_to_csv(post_id):
    data = fetch_data()

    filtered_data = []

    for record in data:
        if str(record.get("postId")) == str(post_id):
            comments = record.get("comments", [])

            for comment in comments:
                comment_text = comment.get("commentText", "")
                filtered_data.append({"commentText": comment_text})

    if filtered_data:
        df = pd.DataFrame(filtered_data)
        filename = f"env/src/Krish/CSV/Output_{post_id}.csv"
        df.to_csv(filename, index=False)
        print(f"CSV file successfully created: {filename}")
    else:
        print(f"No comments found for postId: {post_id}")

if __name__ == "__main__":
    user_post_id = "67a38f22644da7bec8c06050"  # User se input lega
    convert_to_csv(user_post_id)


# D:\VsCode\miniproject-2A\IndianArtMate-2.O\env\src\Krish\CSV