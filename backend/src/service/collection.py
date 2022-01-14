#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from uuid import uuid1
from flask import jsonify
import hashlib

from .common import update_book_meta

from ..database.sqlite import db
from ..util.util import convert_to_binary_data


md5_hash = hashlib.md5()


def create_book_collection(name, description, subjects, stars, cover):
    uuid = str(uuid1())

    book_collection = db.query(
        "select name from book_collection where name='{}'".format(name))
    if len(book_collection) > 0:
        return

    db.insert_book_collection(uuid, name, description, subjects, stars, cover)


def update_book_collection(books_uuids, coll_uuid):
    db.run_sql("update book_collection set book_uuids='{}' where uuid='{}'".format(
        books_uuids, coll_uuid))


def get_book_collections():
    data = db.query("select * from book_collection;")
    return jsonify(data)


def delete_book_collections(uuid, collection_name):
    db.run_sql("delete from cover where uuid='{}'".format(uuid))
    book_metas = db.query(
        "select uuid, collection_names from book_meta where collection_names like '%{}%'".format(collection_name))
    for book_meta in book_metas:
        collection_names = book_meta['collection_names'].split(';')
        collection_names.remove(collection_name)
        update_book_meta(book_meta['uuid'], 'collection_names', ';'.join(collection_names))

    db.run_sql("delete from book_collection where uuid='{}';".format(uuid))
    return "success"


def update_collection(uuid, key, value):
    db.run_sql("update book_collection set '{}'='{}' where uuid='{}'".format(
        key, value, uuid))
    return "success"
