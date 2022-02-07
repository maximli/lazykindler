#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from re import I
from uuid import uuid1
from flask import jsonify
import hashlib

from .common import update_book_meta

from ..database.sqlite import db
from ..util.util import convert_to_binary_data, generate_uuid, get_md5, get_now, is_all_chinese, difference


md5_hash = hashlib.md5()


def create_collection(name, description, subjects, stars, cover):
    uuid = generate_uuid()

    book_collection = db.query(
        "select name from book_collection where name='{}'".format(name))
    if len(book_collection) > 0:
        return

    db.insert_book_collection(uuid, name, description, subjects, stars, cover)


def update_book_collection(books_uuids, coll_uuid):
    db.run_sql("update book_collection set book_uuids='{}' where uuid='{}'".format(
        books_uuids, coll_uuid))


def get_all_collections():
    data = db.query("select * from book_collection;")
    return jsonify(data)


def get_multiple_collections(uuids):
    data = []
    for uuid in uuids:
        if uuid == "":
            continue
        item = db.query(
            "select * from book_collection where uuid='{}';".format(uuid))
        data.append(item[0])
    return jsonify(data)


def delete_book_collections_without_books(coll_uuid):
    db.run_sql("delete from cover where uuid='{}'".format(coll_uuid))
    book_metas = db.query(
        "select uuid, coll_uuids from book_meta where coll_uuids like '%{}%'".format(coll_uuid))
    for book_meta in book_metas:
        coll_uuids = book_meta['coll_uuids'].split(';')
        coll_uuids.remove(coll_uuid)
        if coll_uuids is None or len(coll_uuids) == 0:
            db.run_sql_with_params(
                "update book_meta set coll_uuids=? where uuid=?", (None, book_meta["uuid"]))
        else:
            update_book_meta(book_meta['uuid'],
                             'coll_uuids', ';'.join(coll_uuids))

    db.run_sql("delete from book_collection where uuid='{}';".format(coll_uuid))
    return "success"


def delete_book(uuid):
    db.run_sql("delete from book where uuid='{}'".format(uuid))
    db.run_sql("delete from book_meta where uuid='{}'".format(uuid))
    db.run_sql("delete from cover where uuid='{}'".format(uuid))
    db.run_sql("delete from tmp_book where uuid='{}'".format(uuid))

    book_collections = db.query(
        "select uuid, book_uuids from book_collection where book_uuids like '%{}%'".format(uuid))
    for book_collection in book_collections:
        book_uuids = book_collection['book_uuids'].split(';')
        book_uuids.remove(uuid)
        if book_uuids is None or len(book_uuids) == 0:
            db.run_sql_with_params("update book_collection set book_uuids=? where uuid=?", (None, book_collection['uuid']))
        else:
            update_book_collection(';'.join(book_uuids), book_collection['uuid'])
    return "success"


def delete_book_collections_with_books(coll_uuid):
    db.run_sql("delete from cover where uuid='{}'".format(coll_uuid))
    coll_info = db.query(
        "select book_uuids from book_collection where uuid='{}';".format(coll_uuid))[0]
    if coll_info['book_uuids'] is None:
        return "success"
    else:
        for book_uuid in coll_info['book_uuids'].split(";"):
            delete_book(book_uuid)
        db.run_sql(
            "delete from book_collection where uuid='{}';".format(coll_uuid))
    return "success"


def update_collection(uuid, key, value):
    value = value.strip()

    if key == "book_uuids":
        coll_info = db.query(
            "select book_uuids from book_collection where uuid='{}';".format(uuid))[0]
        old_book_uuids = []
        if coll_info["book_uuids"] is not None:
            old_book_uuids = coll_info["book_uuids"].split(";")

        new_book_uuids = []
        if value is not None:
            new_book_uuids = value.split(";")
            if "" in new_book_uuids:
                new_book_uuids.remove("")
            for book_uuid in new_book_uuids:
                db.run_sql(
                    "delete from tmp_book where uuid='{}'".format(book_uuid))

        # 从书籍的关联集合中删掉移除的集合
        for book_uuid in difference(old_book_uuids, new_book_uuids):
            book_info = db.query(
                "select coll_uuids from book_meta where uuid='{}';".format(book_uuid))[0]
            coll_book_uuids = []
            if book_info["coll_uuids"] is not None:
                l = book_info["coll_uuids"].split(";")
                l.remove(uuid)
                if l is not None and len(l) > 0:
                    coll_book_uuids = l
            if len(coll_book_uuids) == 0:
                db.run_sql_with_params(
                    "update book_meta set coll_uuids=? where uuid=?", (None, book_uuid))
            else:
                db.run_sql("update book_meta set coll_uuids='{}' where uuid='{}'".format(
                    ";".join(coll_book_uuids), book_uuid))

        # 往书籍的关联集合中添加新的集合
        for book_uuid in difference(new_book_uuids, old_book_uuids):
            book_info = db.query(
                "select coll_uuids from book_meta where uuid='{}';".format(book_uuid))[0]
            coll_book_uuids = []
            if book_info["coll_uuids"] is not None:
                l = book_info["coll_uuids"].split(";")
                coll_book_uuids = l.append(uuid)
                coll_book_uuids = l
            else:
                coll_book_uuids.append(uuid)
            db.run_sql("update book_meta set coll_uuids='{}' where uuid='{}'".format(
                ";".join(coll_book_uuids), book_uuid))

    if value is None or value is "":
        db.run_sql_with_params(
            "update book_collection set book_uuids=? where uuid=?", (None, uuid))
        return "success"
    else:
        db.run_sql("update book_collection set '{}'='{}' where uuid='{}'".format(
            key, value, uuid))
    return "success"
