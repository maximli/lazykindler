from flask import request
from ..util.service_logger import serviceLogger as logger
from ..service import collection
from ..database.sqlite import db


def create_book_collection():
    content = request.json
    name = content['name']

    book_collection = db.query(
        "select uuid from book_collection where name='{}'".format(name))
    if len(book_collection) > 0:
        return "success"

    description = ""
    if 'description' in content:
        description = content['description']

    subjects = ""
    if 'subjects' in content:
        subjects = content['subjects']

    stars = 0
    if 'stars' in content:
        stars = content['stars']

    cover = ""
    if 'cover' in content:
        cover = content['cover']

    collection.create_book_collection(
        name, description, subjects, stars, cover)
    return "success"


def get_book_collections():
    return collection.get_book_collections()


def delete_book_collection():
    uuid = request.args.get('uuid')
    name = request.args.get('name')
    return collection.delete_book_collections(uuid, name)


def update_book_collection():
    content = request.json
    uuid = content['uuid']
    key = content['key']
    value = content['value']
    return collection.update_collection(uuid, key, value)