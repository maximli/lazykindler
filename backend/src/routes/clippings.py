from flask import request
from ..util.service_logger import serviceLogger as logger
from ..service import clippings
from ..database.sqlite import db


def get_all_clippings():
    return clippings.get_all_clippings()