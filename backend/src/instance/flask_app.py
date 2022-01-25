# instance/flask_app.py

# third-party imports
from flask import Flask
from flask_cors import CORS

from ..routes import books, collection


# flask application initialization
app = Flask(__name__)

# cross origin resource sharing
# CORS(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.add_url_rule('/api/book/upload', view_func=books.store_books, methods=['POST'])
app.add_url_rule('/api/book/all_meta', view_func=books.get_books_meta, methods=['GET'])
app.add_url_rule('/api/book/update/book_meta', view_func=books.update_book_meta, methods=['POST'])
app.add_url_rule('/api/book/cover', view_func=books.get_book_cover, methods=['GET'])
app.add_url_rule('/api/book/delete', view_func=books.delete_book, methods=['DELETE'])

app.add_url_rule('/api/collection/create', view_func=collection.create_book_collection, methods=['POST'])
app.add_url_rule('/api/collection/get', view_func=collection.get_all_collections, methods=['GET'])
app.add_url_rule('/api/collection/get/one', view_func=collection.get_specific_collection, methods=['GET'])
app.add_url_rule('/api/collection/delete', view_func=collection.delete_book_collection, methods=['DELETE'])
app.add_url_rule('/api/collection/update', view_func=collection.update_book_collection, methods=['POST'])
