from flask import jsonify

from ..database.sqlite import db


def get_multiple_clippings_collections(uuids):
    data = []
    for uuid in uuids:
        if uuid == "":
            continue
        item = db.query(
            "select * from clippings_coll where uuid='{}';".format(uuid))
        data.append(item[0])
    return jsonify(data)