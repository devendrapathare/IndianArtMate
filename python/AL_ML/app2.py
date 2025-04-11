# from flask import Flask
# from sentiment_routes import sentiment_bp
# from NLP.routes import nlp_blueprint
# from node2vec.routes import recommend_bp

# app = Flask(__name__)

# app.register_blueprint(sentiment_bp, url_prefix="/sentiment")
# app.register_blueprint(nlp_blueprint, url_prefix="/nlp")
# app.register_blueprint(recommend_bp, url_prefix="/recommend")

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=6000, debug=True)


from flask import Flask
print("✅ Flask imported")

try:
    from sentiment_routes import sentiment_bp
    print("✅ sentiment_routes imported")
except Exception as e:
    print(f"❌ Error importing sentiment_routes: {e}")

try:
    from NLP.routes import nlp_blueprint
    print("✅ NLP.routes imported")
except Exception as e:
    print(f"❌ Error importing NLP.routes: {e}")

try:
    from node2vec.routes import recommend_bp
    print("✅ node2vec.routes imported")
except Exception as e:
    print(f"❌ Error importing node2vec.routes: {e}")

app = Flask(__name__)
print("✅ Flask app created")

try:
    app.register_blueprint(sentiment_bp, url_prefix="/sentiment")
    print("✅ sentiment_bp registered")
except Exception as e:
    print(f"❌ Error registering sentiment_bp: {e}")

try:
    app.register_blueprint(nlp_blueprint, url_prefix="/nlp")
    print("✅ nlp_blueprint registered")
except Exception as e:
    print(f"❌ Error registering nlp_blueprint: {e}")

try:
    app.register_blueprint(recommend_bp, url_prefix="/recommend")
    print("✅ recommend_bp registered")
except Exception as e:
    print(f"❌ Error registering recommend_bp: {e}")

if __name__ == "__main__":
    print("🚀 Starting Flask server...")
    app.run(host="0.0.0.0", port=6000, debug=True)
