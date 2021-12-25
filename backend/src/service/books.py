#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from uuid import uuid1
from flask import jsonify
import hashlib

from ..database.sqlite import db
from ..core.kindle.meta.metadata import get_metadata
from ..util.util import convert_to_binary_data, get_md5, get_now, is_all_chinese


md5_hash = hashlib.md5()


def store_book_from_path(book_path):
    uuid = str(uuid1())

    book_content = convert_to_binary_data(book_path)
    md5 = get_md5(book_path)
    book_meta_record = db.query("select uuid from book_meta where md5='{}'".format(md5))
    if len(book_meta_record) > 0:
        uuid = book_meta_record[0]["uuid"]
        db.run_sql("update tmp_book set create_time='{}' where uuid='{}'".format(get_now(), uuid))
    else:
        # 书名
        title = None
        # 出版商
        publisher = None
        # 作者
        author = None
        # 标签
        subjects = None

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
            base=os.path.basename(book_path)
            title = os.path.splitext(base)[0]
        
        if title == "" or title == None:
            title = "未命名"
        if publisher == "" or publisher == None:
            publisher = "无出版社"
        if author == "" or author == None:
            author = "未署名"
        if subjects == "" or subjects == None:
            subjects = "无标签"
        db.insert_book(uuid, title, "", author, subjects,  book_content, book_size, publisher, extension, md5, book_path)


def get_books_meta(storeType):
    data = db.query("select * from book_meta;")
    return jsonify(data)


def get_book_cover(uuid):
    data = db.query("select content from cover where uuid='{}';".format(uuid))
    return data[0]['content']