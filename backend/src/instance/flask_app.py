# instance/flask_app.py

# third-party imports
from flask import Flask
from flask_cors import CORS
import os
import time

from ..service.clippings import ClippingHelper

from ..routes import books, collection


# flask application initialization
app = Flask(__name__)

# cross origin resource sharing
# CORS(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

pid = os.fork()
if pid == 0:
    while True:
        time.sleep(10)
        clippintHelper = ClippingHelper()
        clippintHelper.import_clippings()

app.add_url_rule('/api/book/upload', view_func=books.store_books, methods=['POST'])
app.add_url_rule('/api/book/all_meta', view_func=books.get_books_meta, methods=['GET'])
app.add_url_rule('/api/book/get/uuids', view_func=books.get_books_meta_by_uuids, methods=['GET'])
app.add_url_rule('/api/book/update/book_meta', view_func=books.update_book_meta, methods=['POST'])
app.add_url_rule('/api/book/cover', view_func=books.get_book_cover, methods=['GET'])
app.add_url_rule('/api/book/delete', view_func=books.delete_book, methods=['DELETE'])
app.add_url_rule('/api/book/delete/bykeyword', view_func=books.delete_book_by_keyword, methods=['DELETE'])

app.add_url_rule('/api/collection/create', view_func=collection.create_collection, methods=['POST'])
app.add_url_rule('/api/collection/get/all', view_func=collection.get_all_collections, methods=['GET'])
app.add_url_rule('/api/collection/get/multiple', view_func=collection.get_multiple_collections, methods=['GET'])
app.add_url_rule('/api/collection/delete/withoutbooks', view_func=collection.delete_book_collection_without_books, methods=['DELETE'])
app.add_url_rule('/api/collection/delete/withbooks', view_func=collection.delete_book_collection_with_books, methods=['DELETE'])
app.add_url_rule('/api/collection/delete/bykeyword', view_func=collection.delete_book_collection_by_keyword, methods=['DELETE'])
app.add_url_rule('/api/collection/update', view_func=collection.update_book_collection, methods=['POST'])
