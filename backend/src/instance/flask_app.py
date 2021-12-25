# instance/flask_app.py

# third-party imports
from flask import Flask
from flask_cors import CORS

from ..routes import books, collection


# local imports
from ..instance.config import config
from ..misc.service_logger import serviceLogger as logger

# flask application initialization
app = Flask(__name__)

# cross origin resource sharing
CORS(app)

app.add_url_rule('/api/book/upload', view_func=books.store_books, methods=['POST'])
app.add_url_rule('/api/book/all_meta', view_func=books.get_books_meta, methods=['GET'])
app.add_url_rule('/api/book/cover', view_func=books.get_book_cover, methods=['GET'])
app.add_url_rule('/api/book/delete', view_func=books.delete_book, methods=['DELETE'])

app.add_url_rule('/api/collection/create', view_func=collection.create_book_collection, methods=['POST'])
app.add_url_rule('/api/collection/get', view_func=collection.get_book_collections, methods=['GET'])
