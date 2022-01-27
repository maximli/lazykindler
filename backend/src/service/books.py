#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from uuid import uuid1
from flask import jsonify
import hashlib

from ..service.collection import update_book_collection

from ..database.sqlite import db
from ..core.kindle.meta.metadata import get_metadata
from ..util.util import convert_to_binary_data, get_md5, get_now, is_all_chinese


md5_hash = hashlib.md5()


def store_book_from_path(book_path):
    uuid = str(uuid1())

    book_content = convert_to_binary_data(book_path)
    md5 = get_md5(book_path)
    book_meta_record = db.query(
        "select uuid from book_meta where md5='{}'".format(md5))
    if len(book_meta_record) > 0:
        uuid = book_meta_record[0]["uuid"]
        db.run_sql(
            "update tmp_book set create_time='{}' where uuid='{}'".format(get_now(), uuid))
    else:
        # 书名
        title = ""
        # 出版商
        publisher = ""
        # 作者
        author = ""
        # 标签
        subjects = ""
        # 集合
        collection_names = ""

        extension = os.path.splitext(book_path)[1]
        book_size = os.path.getsize(book_path)
        meta = get_metadata(book_path)

        for key, value in meta.items():
            if key == "subject":
                res = []
                for v in value:
                    parts = v.split("-")
                    if len(parts):
                        for part in parts:
                            if is_all_chinese(part):
                                res.append(part)
                subjects = ";".join(res)
            if key == "updatedtitle":
                title = ';'.join(value)
            if key == "publisher":
                publisher = ';'.join(value)
            if key == "author":
                author = ";".join(value)

        if title != None:
            title = title.strip()
        if publisher != None:
            publisher = publisher.strip()
        if author != None:
            author = author.strip()
        if subjects != None:
            subjects = subjects.strip()

        if title == "":
            base = os.path.basename(book_path)
            title = os.path.splitext(base)[0]

        if title == "" or title == None:
            title = "未命名"
        if publisher == "" or publisher == None:
            publisher = "无出版社"
        if author == "" or author == None:
            author = "未署名"
        if subjects == "" or subjects == None:
            subjects = "无标签"
        if collection_names == "" or collection_names == None:
            collection_names = "无集合"
        db.insert_book(uuid, title, "", author, subjects,  book_content,
                       book_size, publisher, collection_names, extension, md5, book_path)


def get_books_meta(storeType):
    data = []
    if storeType == 'noTmp':
        # 查找正式存储的数据
        data = db.query("select a.* from book_meta a where not exists (select null from tmp_book b where a.uuid = b.uuid);")
    else:
        # 查找临时存储的数据
        data = db.query("select a.* from book_meta a where exists (select null from tmp_book b where a.uuid = b.uuid); ")
    return jsonify(data)


def get_book_cover(uuid):
    data = db.query("select content from cover where uuid='{}';".format(uuid))
    return data[0]['content']


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
        update_book_collection(';'.join(book_uuids), book_collection['uuid'])
    return "success"


def update_book_meta(uuid, key, value):
    db.run_sql("update book_meta set '{}'='{}' where uuid='{}'".format(
        key, value, uuid))
    return "success"


def get_books_meta_by_uuids(uuids):
    result = []
    for uuid in uuids:
        book_meta_list = db.query("select * from book_meta where uuid='{}'".format(uuid))
        result = result + book_meta_list
    return jsonify(result)