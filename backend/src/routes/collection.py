from flask import request
from ..service import collection
from ..service import cover
from ..database.database import db


def create_collection():
    content = request.json
    name = content['name']

    coll = db.query(
        "select uuid from coll where name='{}'".format(name))
    if len(coll) > 0:
        return "success"

    coll_type = content['coll_type']

    description = None
    if 'description' in content:
        value = content['description']
        if value is not None and value != "":
            description = value

    subjects = None
    if 'subjects' in content:
        value = content['subjects']
        if value is not None and value != "":
            subjects = value

    stars = 0
    if 'stars' in content:
        stars = content['stars']

    cover = None
    if 'cover' in content:
        value = content['cover']
        if value is not None and value != "":
            cover = value

    collection.create_collection(
        name, coll_type, description, subjects, stars, cover)
    return "success"


def get_all_collections():
    coll_type = request.args.get('coll_type')
    return collection.get_all_collections(coll_type)


def get_multiple_collections():
    uuids = request.args.get('uuids')
    return collection.get_multiple_collections(uuids.split(';'))


def delete_coll_without_items():
    uuid = request.args.get('uuid')
    return collection.delete_colls_without_items(uuid)


def delete_coll_with_items():
    uuid = request.args.get('uuid')
    return collection.delete_colls_with_items(uuid)


def update_coll():
    content = request.json
    uuid = content['uuid']
    key = content['key']
    value = content['value']
    return collection.update_collection(uuid, key, value)


def delete_coll_by_keyword():
    keyword = request.args.get('keyword')
    value = request.args.get('value')
    return collection.delete_colls_by_keyword(keyword, value)


def update_coll_cover():
    content = request.json
    coll_uuid = content['coll_uuid']
    cover_str = content['cover']
    return cover.update_coll_cover(coll_uuid, cover_str)