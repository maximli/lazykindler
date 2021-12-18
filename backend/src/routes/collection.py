from flask import request
from ..util.service_logger import serviceLogger as logger
from ..service import collection
from ..database.sqlite import db


def create_book_collection():
    content = request.json
    name = content['name']

    book_collection = db.query("select uuid from book_collection where name='{}'".format(name))
    if len(book_collection) > 0:
        return "success"

    description = None 
    if 'description' in content:
        description = content['description']

    subjects = None
    if 'subjects' in content:
        subjects = content['subjects']

    stars = None
    if 'stars' in content:
        stars = content['stars']

    cover_path = None
    if 'cover_path' in content:
        cover_path = content['cover_path']

    collection.create_book_collection(name, description, subjects, stars, cover_path)
    return "success"