from ..util.service_logger import serviceLogger as logger
from ..service import books
from flask import request


def store_book():
    """
    GET request endpoint of UsersInfo
    :return:

        "Hello world, from Users!"
    """
    content = request.json
    book_paths = content['book_paths']

    for book_path in book_paths:
        books.store_book_from_path(book_path)
    return "success"
