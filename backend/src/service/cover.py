
from ..util.util import get_now, utf8len
from ..database.database import db

# 主要用来更新集合的封面
def update_coll_cover(coll_uuid, cover):
    db.run_sql("update cover set content='{}' where uuid='{}'".format(
            cover, coll_uuid))
    return "success"


def upsert_book_cover(uuid, name, content):
        cover = db.query("select uuid from cover where uuid='{}';".format(uuid))
        if cover is None or len(cover) == 0:
                sql = """INSERT INTO cover (uuid, name, size, content, create_time ) 
                                        VALUES (?, ?, ?, ?, ?) """

                flag = 1
                if content.endswith("=="):
                        flag = 2

                size = ((utf8len(content)) * (3/4)) - flag

                cur = db.conn.cursor()
                cur.execute(sql, (uuid, name, size, content, get_now()))
                db.conn.commit()
        else:
                db.run_sql("update cover set content='{}' where uuid='{}'".format(
                content, uuid))
        return "success"