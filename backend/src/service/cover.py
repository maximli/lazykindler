
from ..database.database import db

# 主要用来更新集合的封面
def update_coll_cover(coll_uuid, cover):
    db.run_sql("update cover set content='{}' where uuid='{}'".format(
            cover, coll_uuid))
    return "success"