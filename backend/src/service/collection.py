#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from uuid import uuid1
from flask import jsonify
import hashlib

from ..database.sqlite import db
from ..util.util import convert_to_binary_data


md5_hash = hashlib.md5()


def create_book_collection(name, description, subjects, stars, cover):
    uuid = str(uuid1())

    book_collection = db.query("select name from book_collection where name='{}'".format(name))
    if len(book_collection) > 0:
        return

    db.insert_book_collection(uuid, name, description, subjects, stars, cover)


def update_book_collection(books_uuids, coll_uuid):
    db.run_sql("update book_collection set book_uuids='{}' where uuid='{}'".format(books_uuids, coll_uuid))
    

def get_book_collections():
    data = db.query("select * from book_collection;")
    return jsonify(data)


def delete_book_collections(uuid):
    db.run_sql("delete from book_collection where uuid='{}';".format(uuid))
    return "success"