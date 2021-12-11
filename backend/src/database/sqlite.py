import sqlite3
from sqlite3 import Error
from ..util.service_logger import serviceLogger as logger
from ..util.util import now
from ..core.kindle.cover import get_mobi_cover


def write_to_file(data, filename):
    # Convert binary data to proper format and write it on Hard Disk
    with open(filename, 'wb') as file:
        file.write(data)
    print("Stored blob data into: ", filename, "\n")


class DB:
    def __init__(self):
        """ create a database connection to the SQLite database
                specified by the db_file
            :param db_file: database file
            :return: Connection object or None
            """
        self.conn = None
        try:
            import os.path
            base_dir = os.path.dirname(os.path.abspath(__file__))
            db_path = os.path.join(base_dir, "lazykindler.db")
            self.conn = sqlite3.connect(db_path, check_same_thread=False)
            self.conn.isolation_level = None
        except Error as e:
            print(e)

    def run_sql(self, sql):
        """
        执行sql，不返回结果
        :return:
        """
        cur = self.conn.cursor()
        cur.execute(sql)
        self.conn.commit()

    def query(self, sql):
        try:
            cursor = self.conn.cursor()
            cursor.execute(sql)
            data=cursor.fetchall()
            return data
        except Exception as error:
            print("Failed to get record. ", error)

    def insert_book(self, uuid, title, publisher, book_content, author, book_size, extension, md5, book_path):
        cursor = self.conn.cursor()
        cursor.execute("begin")
        try:

            # 插入书籍元数据信息
            sql = """INSERT INTO book_meta (uuid, book_name, book_size, publisher, 
            author, cover_format, cover_content, md5, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) """
            cover_info = get_mobi_cover.get_mobi_cover(book_path)

            data_tuple = (
                uuid,
                title,
                book_size,
                publisher,
                author,
                cover_info["cover_format"],
                cover_info["content"],
                md5,
                now()
            )
            cursor.execute(sql, data_tuple)


            # 插入书籍信息
            sql = """INSERT INTO book (uuid, book_name, book_format, book_size, book_content, 
                                            create_time) VALUES (?, ?, ?, ?, ?, ?) """
            data_tuple = (uuid, title, extension, book_size, book_content, now())
            cursor.execute(sql, data_tuple)


            # 插入临时书籍
            sql = """INSERT INTO tmp_book (uuid, create_time) VALUES (?, ?) """
            data_tuple = (uuid, now())
            cursor.execute(sql, data_tuple)

        except Exception as error:
            self.conn.execute("rollback")
            print("Failed to insert books. ", error)

        self.conn.commit()
        cursor.close()


    def get_book(self, uuid, filepath):
        try:
            cursor = self.conn.cursor()

            sql_fetch_blob_query = """SELECT content from book where uuid = ?"""
            cursor.execute(sql_fetch_blob_query, (uuid,))
            record = cursor.fetchall()
            for row in record:
                content = row[0]
                write_to_file(content, filepath)

            cursor.close()

        except Exception as error:
            print("Failed to get book record. ", error)


db = DB()
