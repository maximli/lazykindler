#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import jsonify
import hashlib

from .common import update_book_meta, update_clipping

from ..database.database import db
from ..util.util import generate_uuid, difference


md5_hash = hashlib.md5()


def create_collection(name, coll_type, description, subjects, stars, cover):
    uuid = generate_uuid()

    colls = db.query(
        "select name from coll where name='{}' and coll_type='{}'".format(name, coll_type))
    if len(colls) > 0:
        # 不允许创建多个具有相同名称和集合类型的coll
        return

    db.insert_coll(uuid, name, coll_type, description, subjects, stars, cover)


def update_coll(item_uuids, coll_uuid):
    db.run_sql("update coll set item_uuids='{}' where uuid='{}'".format(
        item_uuids, coll_uuid))


def get_all_collections(coll_type):
    data = db.query("select * from coll where coll_type='{}';".format(coll_type))
    return jsonify(data)


def get_multiple_collections(uuids):
    data = []
    for uuid in uuids:
        if uuid == "":
            continue
        item = db.query(
            "select * from coll where uuid='{}';".format(uuid))
        data.append(item[0])
    return jsonify(data)


def delete_book(uuid):
    db.run_sql("delete from book where uuid='{}'".format(uuid))
    db.run_sql("delete from book_meta where uuid='{}'".format(uuid))
    db.run_sql("delete from cover where uuid='{}'".format(uuid))
    db.run_sql("delete from tmp_book where uuid='{}'".format(uuid))

    colls = db.query(
        "select uuid, item_uuids from coll where item_uuids like '%{}%'".format(uuid))
    for coll in colls:
        item_uuids = coll['item_uuids'].split(';')
        item_uuids.remove(uuid)
        if item_uuids is None or len(item_uuids) == 0:
            db.run_sql_with_params(
                "update coll set item_uuids=? where uuid=?", (None, coll['uuid']))
        else:
            update_coll(';'.join(item_uuids),
                                   coll['uuid'])
    return "success"


def delete_clipping(uuid):
    db.run_sql("delete from clipping where uuid='{}'".format(uuid))

    colls = db.query(
        "select uuid, item_uuids from coll where item_uuids like '%{}%'".format(uuid))
    for coll in colls:
        item_uuids = coll['item_uuids'].split(';')
        item_uuids.remove(uuid)
        if item_uuids is None or len(item_uuids) == 0:
            db.run_sql_with_params(
                "update coll set item_uuids=? where uuid=?", (None, coll['uuid']))
        else:
            update_coll(';'.join(item_uuids),
                                   coll['uuid'])
    return "success"


def delete_colls_without_items(coll_uuid):
    db.run_sql("delete from cover where uuid='{}'".format(coll_uuid))

    # 如果是coll是book类型
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
    
    # 如果是coll是clipping类型
    clippings = db.query(
        "select uuid, coll_uuids from clipping where coll_uuids like '%{}%'".format(coll_uuid))
    for clipping in clippings:
        coll_uuids = clipping['coll_uuids'].split(';')
        coll_uuids.remove(coll_uuid)
        if coll_uuids is None or len(coll_uuids) == 0:
            db.run_sql_with_params(
                "update clipping set coll_uuids=? where uuid=?", (None, clipping["uuid"]))
        else:
            update_clipping(clipping['uuid'],
                             'coll_uuids', ';'.join(coll_uuids))

    db.run_sql("delete from coll where uuid='{}';".format(coll_uuid))
    return "success"


def delete_colls_with_items(coll_uuid):
    db.run_sql("delete from cover where uuid='{}'".format(coll_uuid))

    coll_info = db.query(
        "select item_uuids from coll where uuid='{}';".format(coll_uuid))[0]
    if coll_info['item_uuids'] is not None:
        for book_uuid in coll_info['item_uuids'].split(";"):
            delete_book(book_uuid)
        for clipping_uuid in coll_info['item_uuids'].split(";"):
            delete_clipping(clipping_uuid)
    db.run_sql(
        "delete from coll where uuid='{}';".format(coll_uuid))
    return "success"


def update_collection(uuid, key, value):
    value = value.strip()
    value = value.replace(' ', '')
    value = value.removesuffix(';')

    coll_info = db.query(
        "select coll_type, item_uuids from coll where uuid='{}';".format(uuid))[0]

    if key == "item_uuids":
            old_item_uuids = []
            if coll_info["item_uuids"] is not None:
                old_item_uuids = coll_info["item_uuids"].split(";")

            new_item_uuids = []
            if value is not None:
                new_item_uuids = value.split(";")
                if "" in new_item_uuids:
                    new_item_uuids.remove("")
                for book_uuid in new_item_uuids:
                    db.run_sql(
                        "delete from tmp_book where uuid='{}'".format(book_uuid))

            if coll_info['coll_type'] == 'book':
                # 从书籍的关联集合中删掉移除的集合
                for book_uuid in difference(old_item_uuids, new_item_uuids):
                    book_info = db.query(
                        "select coll_uuids from book_meta where uuid='{}';".format(book_uuid))[0]
                    coll_item_uuids = []
                    if book_info["coll_uuids"] is not None:
                        l = book_info["coll_uuids"].split(";")
                        l.remove(uuid)
                        if l is not None and len(l) > 0:
                            coll_item_uuids = l
                    if len(coll_item_uuids) == 0:
                        db.run_sql_with_params(
                            "update book_meta set coll_uuids=? where uuid=?", (None, book_uuid))
                    else:
                        db.run_sql("update book_meta set coll_uuids='{}' where uuid='{}'".format(
                            ";".join(coll_item_uuids), book_uuid))

                # 往书籍的关联集合中添加新的集合
                for book_uuid in difference(new_item_uuids, old_item_uuids):
                    book_info = db.query(
                        "select coll_uuids from book_meta where uuid='{}';".format(book_uuid))[0]
                    coll_item_uuids = []
                    if book_info["coll_uuids"] is not None:
                        l = book_info["coll_uuids"].split(";")
                        coll_item_uuids = l.append(uuid)
                        coll_item_uuids = l
                    else:
                        coll_item_uuids.append(uuid)
                    db.run_sql("update book_meta set coll_uuids='{}' where uuid='{}'".format(
                        ";".join(coll_item_uuids), book_uuid))
            else:
                # 从clipping的关联集合中删掉移除的集合
                for clipping_uuid in difference(old_item_uuids, new_item_uuids):
                    clipping_info = db.query(
                        "select coll_uuids from clipping where uuid='{}';".format(clipping_uuid))[0]
                    coll_item_uuids = []
                    if clipping_info["coll_uuids"] is not None:
                        l = clipping_info["coll_uuids"].split(";")
                        l.remove(uuid)
                        if l is not None and len(l) > 0:
                            coll_item_uuids = l
                    if len(coll_item_uuids) == 0:
                        db.run_sql_with_params(
                            "update clipping set coll_uuids=? where uuid=?", (None, clipping_uuid))
                    else:
                        db.run_sql("update clipping set coll_uuids='{}' where uuid='{}'".format(
                            ";".join(coll_item_uuids), clipping_uuid))

                # 往clipping的关联集合中添加新的集合
                for clipping_uuid in difference(new_item_uuids, old_item_uuids):
                    clipping_info = db.query(
                        "select coll_uuids from clipping where uuid='{}';".format(clipping_uuid))[0]
                    coll_item_uuids = []
                    if clipping_info["coll_uuids"] is not None:
                        l = clipping_info["coll_uuids"].split(";")
                        coll_item_uuids = l.append(uuid)
                        coll_item_uuids = l
                    else:
                        coll_item_uuids.append(uuid)
                    db.run_sql("update clipping set coll_uuids='{}' where uuid='{}'".format(
                        ";".join(coll_item_uuids), clipping_uuid))

    if key == "item_uuids" and (value is None or value == ""):
        db.run_sql_with_params(
            "update coll set item_uuids=? where uuid=?", (None, uuid))
        return "success"
    else:
        db.run_sql("update coll set {}='{}' where uuid='{}'".format(
            key, value, uuid))
    return "success"


def delete_colls_by_keyword(keyword, value):
    value = value.strip()
    uuids = []
    if keyword == "评分":
        colls = db.query(
            "select uuid from coll where stars='{}'".format(int(value)))
        for coll in colls:
            uuids.append(coll['uuid'])
    elif keyword == "标签":
        colls = db.query(
            "select uuid from coll where subjects like '^{};%' or subjects like '%;{}$' or subjects like '%;{};%' or subjects='{}'".format(value, value, value, value))
        for coll in colls:
            uuids.append(coll['uuid'])

    for uuid in uuids:
        delete_colls_with_items(uuid)

    return "success"
