from flask import jsonify

from ..util.util import generate_uuid, get_now, utf8len
from ..database.database import db


def get_comments_of_related_uuid(related_uuid):
    data = db.query(
        "select * from comment where related_uuid='{}';".format(related_uuid))
    data.sort(key=lambda x: x['create_time'], reverse=True)
    if data is None:
        data = []
    return jsonify(data)


def delete_comment(uuid):
    db.run_sql("delete from comment where uuid='{}'".format(uuid))
    return "success"


def create_comment(related_uuid, content):
    db.insert_comment(generate_uuid(), related_uuid, content)
    return "success"


def update_comment(uuid, newContent):
    db.run_sql("update comment set content='{}' where uuid='{}'".format(
        newContent, uuid))
    return "success"
