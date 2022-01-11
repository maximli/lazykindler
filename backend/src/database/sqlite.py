import sqlite3
from sqlite3 import Error
import sys
import base64
from ..util.service_logger import serviceLogger as logger
from ..util.util import get_now
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

            desc = cursor.description
            column_names = [col[0] for col in desc]
            data = [dict(zip(column_names, row))
                    for row in cursor.fetchall()]
            return data

        except Exception as error:
            print("Failed to get record. ", error)

    def insert_book(self, uuid, title, description, author, subjects,  book_content, book_size, publisher, collection_names, extension, md5, book_path):
        cursor = self.conn.cursor()
        cursor.execute("begin")

        try:
            # 插入书籍元数据信息
            sql = """INSERT INTO book_meta (uuid, name, description, author, subjects, stars, size, publisher, collection_names, done_dates, md5, create_time) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) """
            cover_info = get_mobi_cover.get_mobi_cover(book_path)

            data_tuple = (
                uuid,
                title,
                description,
                author,
                subjects,
                0,
                book_size,
                publisher,
                collection_names,
                "",
                md5,
                get_now()
            )
            cursor.execute(sql, data_tuple)

            # 插入书籍封面信息
            sql = """INSERT INTO cover (uuid, name, size, content, create_time ) 
                                        VALUES (?, ?, ?, ?, ?) """
            data_tuple = (uuid, title, sys.getsizeof(
                cover_info["content"]), base64.b64encode(cover_info["content"]), get_now())
            cursor.execute(sql, data_tuple)

            # 插入书籍信息
            sql = """INSERT INTO book (uuid, name, format, size, content, create_time) 
                                        VALUES (?, ?, ?, ?, ?, ?) """
            data_tuple = (uuid, title, extension, book_size,
                          book_content, get_now())
            cursor.execute(sql, data_tuple)

            # 插入临时书籍
            sql = """INSERT INTO tmp_book (uuid, create_time) VALUES (?, ?) """
            data_tuple = (uuid, get_now())
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

    def insert_book_collection(self, uuid, name, description, subjects, stars, cover_content):
        cursor = self.conn.cursor()
        cursor.execute("begin")
        try:

            sql = """INSERT INTO book_collection (uuid, name, description, subjects, stars, create_time) 
                                        VALUES (?, ?, ?, ?, ?, ?) """
            data_tuple = (
                uuid,
                name,
                description,
                subjects,
                stars,
                get_now()
            )
            cursor.execute(sql, data_tuple)

            if cover_content is not None:
                sql = """INSERT INTO cover (uuid, name, size, content, create_time ) 
                                            VALUES (?, ?, ?, ?, ?) """
                data_tuple = (uuid, name, sys.getsizeof(
                    cover_content), cover_content, get_now())
                cursor.execute(sql, data_tuple)

        except Exception as error:
            self.conn.execute("rollback")
            print("Failed to insert book_collection. ", error)

        self.conn.commit()
        cursor.close()


db = DB()
