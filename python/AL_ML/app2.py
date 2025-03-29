from flask import Flask
from sentiment_routes import sentiment_bp
# from shaswat.NLP.routes import nlp_blueprint
# from shaswat.node2vec.routes import recommend_bp
from NLP.routes import nlp_blueprint
from node2vec.routes import recommend_bp

app = Flask(__name__)

app.register_blueprint(sentiment_bp, url_prefix="/sentiment")
app.register_blueprint(nlp_blueprint, url_prefix="/nlp")
app.register_blueprint(recommend_bp, url_prefix="/recommend")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000, debug=True)
