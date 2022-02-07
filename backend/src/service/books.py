#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from uuid import uuid1
from flask import jsonify
import hashlib

from ..service.collection import update_book_collection

from ..database.sqlite import db
from ..core.kindle.meta.metadata import get_metadata
from ..util.util import convert_to_binary_data, generate_uuid, get_md5, get_now, is_all_chinese, difference


md5_hash = hashlib.md5()


def store_book_from_path(book_path):
    uuid = generate_uuid()

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
        coll_uuids = ""

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

        if title == "":
            title = None
        if publisher == "":
            publisher = None
        if author == "":
            author = None
        if subjects == "":
            subjects = None
        if coll_uuids == "":
            coll_uuids = None
        db.insert_book(uuid, title, None, author, subjects,  book_content,
                       book_size, publisher, coll_uuids, extension, md5, book_path)


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
        if book_uuids is None or len(book_uuids) == 0:
            db.run_sql_with_params("update book_collection set book_uuids=? where uuid=?", (None, book_collection['uuid']))
        else:
            update_book_collection(';'.join(book_uuids), book_collection['uuid'])
    return "success"


def update_book_meta(uuid, key, value):
    value = value.strip()

    if key == "coll_uuids":
        db.run_sql("delete from tmp_book where uuid='{}'".format(uuid))

        book_meta = db.query("select coll_uuids from book_meta where uuid='{}';".format(uuid))[0]
        old_coll_uuids = []
        if book_meta["coll_uuids"] is not None:
            old_coll_uuids = book_meta["coll_uuids"].split(";")
        
        new_coll_uuids = []
        if value is not None:
            new_coll_uuids = value.split(";")
            if "" in new_coll_uuids:
                new_coll_uuids.remove("")

        # 处理删掉的集合，从集合中删掉书籍
        for coll_uuid in difference(old_coll_uuids, new_coll_uuids):
            coll_info = db.query("select book_uuids from book_collection where uuid='{}';".format(coll_uuid))[0]
            coll_book_uuids = []
            if coll_info["book_uuids"] is not None:
                l = coll_info["book_uuids"].split(";")
                l.remove(uuid)
                if l is not None and len(l) > 0:
                    coll_book_uuids = l
            if len(coll_book_uuids) == 0:
                db.run_sql_with_params("update book_collection set book_uuids=? where uuid=?", (None, coll_uuid))
            else:
                db.run_sql("update book_collection set book_uuids='{}' where uuid='{}'".format(
                    ";".join(coll_book_uuids), coll_uuid))

        # 处理新增书籍的集合
        for coll_uuid in difference(new_coll_uuids, old_coll_uuids):
            coll_info = db.query("select book_uuids from book_collection where uuid='{}';".format(coll_uuid))[0]
            coll_book_uuids = []
            if coll_info["book_uuids"] is not None:
                l = coll_info["book_uuids"].split(";")
                coll_book_uuids = l.append(uuid)
                coll_book_uuids = l
            else:
                coll_book_uuids.append(uuid)
            db.run_sql("update book_collection set book_uuids='{}' where uuid='{}'".format(
                ";".join(coll_book_uuids), coll_uuid))

    if value is None or value is "":
        db.run_sql_with_params("update book_meta set {}=? where uuid=?".format(key), (None, uuid))
        return "success"
    else:
        db.run_sql("update book_meta set '{}'='{}' where uuid='{}'".format(
            key, value, uuid))
    return "success"


def get_books_meta_by_uuids(uuids):
    result = []
    for uuid in uuids:
        book_meta_list = db.query("select * from book_meta where uuid='{}'".format(uuid))
        result = result + book_meta_list
    return jsonify(result)


def delete_books_by_keyword(keyword, value):
    uuids = []
    if keyword == "评分":
        books = db.query(
            "select uuid from book_meta where stars='{}'".format(int(value)))
        for book in books:
            uuids.append(book['uuid'])
    elif keyword == "标签":
        books = db.query(
            "select uuid from book_meta where subjects like '%{}%'".format(value))
        for book in books:
            uuids.append(book['uuid'])
    elif keyword == "作者":
        pass
    elif keyword == "出版社":
        pass

    for uuid in uuids:
        delete_book(uuid)

    return "success"