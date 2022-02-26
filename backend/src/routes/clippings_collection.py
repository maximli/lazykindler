from flask import request
from ..util.service_logger import serviceLogger as logger
from ..service import clippings_collection
from ..database.sqlite import db


def get_multiple_clippings_collections():
    uuids = request.args.get('uuids')
    return clippings_collection.get_multiple_clippings_collections(uuids.split(';'))
