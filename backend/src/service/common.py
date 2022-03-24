from ..database.database import db

def update_book_meta(uuid, key, value):
    db.run_sql("update book_meta set {}='{}' where uuid='{}'".format(
        key, value, uuid))
    return "success"


def update_clipping(uuid, key, value):
    db.run_sql("update clipping set {}='{}' where uuid='{}'".format(
        key, value, uuid))
    return "success"