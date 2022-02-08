from flask import request
from ..util.service_logger import serviceLogger as logger
from ..service import collection
from ..database.sqlite import db


def create_collection():
    content = request.json
    name = content['name']

    book_collection = db.query(
        "select uuid from book_collection where name='{}'".format(name))
    if len(book_collection) > 0:
        return "success"

    description = None
    if 'description' in content:
        value = content['description']
        if value is not None and value is not "":
            description = value

    subjects = None
    if 'subjects' in content:
        value = content['subjects']
        if value is not None and value is not "":
            subjects = value

    stars = 0
    if 'stars' in content:
        stars = content['stars']

    cover = None
    if 'cover' in content:
        value = content['cover']
        if value is not None and value is not "":
            cover = value

    collection.create_collection(
        name, description, subjects, stars, cover)
    return "success"


def get_all_collections():
    return collection.get_all_collections()


def get_multiple_collections():
    uuids = request.args.get('uuids')
    return collection.get_multiple_collections(uuids.split(';'))


def delete_book_collection_without_books():
    uuid = request.args.get('uuid')
    return collection.delete_book_collections_without_books(uuid)


def delete_book_collection_with_books():
    uuid = request.args.get('uuid')
    return collection.delete_book_collections_with_books(uuid)


def update_book_collection():
    content = request.json
    uuid = content['uuid']
    key = content['key']
    value = content['value']
    return collection.update_collection(uuid, key, value)


def delete_book_collection_by_keyword():
    keyword = request.args.get('keyword')
    value = request.args.get('value')
    return collection.delete_colls_by_keyword(keyword, value)