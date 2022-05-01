from flask import request
from ..service import clipping


def get_all_clippings():
    return clipping.get_all_clippings()


def get_clipping_by_uuids():
    uuids_str = request.args.get('uuids')
    data = clipping.get_clipping_by_uuids(uuids_str.split(";"))
    return data


def delete_clipping():
    uuid = request.args.get('uuid')
    return clipping.delete_clipping(uuid)


def update_clipping():
    content = request.json
    uuid = content['uuid']
    key = content['key']
    value = content['value']
    return clipping.update_clipping(uuid, key, value)


def delete_all_clipping():
    return clipping.delete_all_clipping()