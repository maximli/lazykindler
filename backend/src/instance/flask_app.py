# instance/flask_app.py

# third-party imports
from flask import Flask
from flask_cors import CORS

from ..routes import books


# local imports
from ..instance.config import config
from ..misc.service_logger import serviceLogger as logger

# flask application initialization
app = Flask(__name__)

# cross origin resource sharing
CORS(app)

app.add_url_rule('/book/upload', view_func=books.store_book, methods=['POST'])
