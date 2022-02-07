from flask import request
import os
import glob
import pathlib

from ..util.service_logger import serviceLogger as logger
from ..service import books

supportedBookFormat = {
    ".mobi": True,
    ".azw3": True,
}

def store_books():
    """
    GET request endpoint of UsersInfo
    :return:

        "Hello world, from Users!"
    """
    content = request.json
    book_paths = content['book_paths']

    for book_path in book_paths:
        if os.path.isdir(book_path):
            glob_dir = os.path.join(book_path, "*")
            bpaths = glob.glob(glob_dir)
            for bpath in bpaths:
                if pathlib.Path(bpath).suffix in supportedBookFormat:
                    print(bpath)
                    books.store_book_from_path(bpath)
        else:
            if pathlib.Path(book_path).suffix in supportedBookFormat:
                books.store_book_from_path(book_path)
    return "success"


def get_books_meta():
    storeType = request.args.get('storeType')
    data = books.get_books_meta(storeType)
    return data

def get_books_meta_by_uuids():
    uuids_str = request.args.get('uuids')
    data = books.get_books_meta_by_uuids(uuids_str.split(";"))
    return data


def get_book_cover():
    uuid = request.args.get('uuid')
    return books.get_book_cover(uuid)


def delete_book():
    uuid = request.args.get('uuid')
    return books.delete_book(uuid)


def update_book_meta():
    content = request.json
    uuid = content['uuid']
    key = content['key']
    value = content['value']
    return books.update_book_meta(uuid, key, value)
