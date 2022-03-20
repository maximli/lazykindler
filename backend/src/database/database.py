import sqlite3
import sys
import base64
from contextlib import closing
from ..util.util import get_now
from ..core.kindle.cover import get_mobi_cover
from mysql.connector import pooling


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
        self.connection_pool = pooling.MySQLConnectionPool(pool_name="lazykindler",
                                                  pool_size=10,
                                                  pool_reset_session=True,
                                                  host='localhost',
                                                  database='lazykindler',
                                                  user='root',
                                                  password='')

    def run_sql(self, sql):
        """
        执行sql,不返回结果
        :return:
        """
        with closing(self.connection_pool.get_connection()) as cnx:
            cursor = cnx.cursor()
            cursor.execute('set global max_allowed_packet=670108864')
            cursor.execute(sql)
            cnx.commit()

    def run_sql_with_params(self, sql, params):
        """
        执行sql,不返回结果
        :return:
        """
        with closing(self.connection_pool.get_connection()) as cnx:
            cursor = cnx.cursor()
            cursor.execute('set global max_allowed_packet=670108864')
            cursor.execute(sql, params)
            cnx.commit()


    def query(self, sql):
        with closing(self.connection_pool.get_connection()) as cnx:
            cursor = cnx.cursor()
            cursor.execute('set global max_allowed_packet=670108864')
            try:
                cursor.execute(sql)

                desc = cursor.description
                column_names = [col[0] for col in desc]
                data = [dict(zip(column_names, row))
                        for row in cursor.fetchall()]
                return data

            except Exception as error:
                print("Failed to get record. ", error)


    def insert_book(self, uuid, title, description, author, subjects,  book_content, book_size, publisher, coll_uuids, extension, md5, book_path):
        with closing(self.connection_pool.get_connection()) as cnx:
            cursor = cnx.cursor()
            cursor.execute('set global max_allowed_packet=670108864')
            try:
                cursor.execute("begin")
                # 插入书籍元数据信息
                sql = """INSERT INTO book_meta (uuid, name, description, author, subjects, stars, size, publisher, coll_uuids, done_dates, md5, create_time) 
                                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) """
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
                    coll_uuids,
                    "",
                    md5,
                    get_now()
                )
                cursor.execute(sql, data_tuple)

                # 插入书籍封面信息
                sql = """INSERT INTO cover (uuid, name, size, content, create_time ) 
                                            VALUES (%s, %s, %s, %s, %s) """
                data_tuple = (uuid, title, sys.getsizeof(
                    cover_info["content"]), base64.b64encode(cover_info["content"]), get_now())
                cursor.execute(sql, data_tuple)

                # 插入书籍信息
                sql = """INSERT INTO book (uuid, name, format, size, content, create_time) 
                                            VALUES (%s, %s, %s, %s, %s, %s) """
                data_tuple = (uuid, title, extension, book_size,
                            book_content, get_now())
                cursor.execute(sql, data_tuple)

                # 插入临时书籍
                sql = """INSERT INTO tmp_book (uuid, create_time) VALUES (%s, %s) """
                data_tuple = (uuid, get_now())
                cursor.execute(sql, data_tuple)

                cnx.commit()
                cursor.close()

            except Exception as error:
                cursor.execute("rollback")


    def get_book(self, uuid, filepath):
        with closing(self.connection_pool.get_connection()) as cnx:
            cursor = cnx.cursor()
            cursor.execute('set global max_allowed_packet=670108864')
            try:
                sql_fetch_blob_query = """SELECT content from book where uuid = ?"""
                cursor.execute(sql_fetch_blob_query, (uuid,))
                record = cursor.fetchall()
                for row in record:
                    content = row[0]
                    write_to_file(content, filepath)

                cursor.close()

            except Exception as error:
                print("Failed to get book record. ", error)


    def insert_coll(self, uuid, name, coll_type, description, subjects, stars, cover_content):
        with closing(self.connection_pool.get_connection()) as cnx:
            cursor = cnx.cursor()
            cursor.execute('set global max_allowed_packet=670108864')
            try:
                cursor.execute("begin")
                sql = """INSERT INTO coll (uuid, name, coll_type, description, subjects, stars, create_time) 
                                            VALUES (%s, %s, %s, %s, %s, %s, %s) """
                data_tuple = (
                    uuid,
                    name,
                    coll_type,
                    description,
                    subjects,
                    stars,
                    get_now()
                )
                cursor.execute(sql, data_tuple)

                if cover_content is not None:
                    sql = """INSERT INTO cover (uuid, name, size, content, create_time ) 
                                                VALUES (%s, %s, %s, %s, %s) """
                    data_tuple = (uuid, name, sys.getsizeof(
                        cover_content), cover_content, get_now())
                    cursor.execute(sql, data_tuple)

                cnx.commit()
                cursor.close()

            except Exception as error:
                cnx.execute("rollback")
                print("Failed to insert coll. ", error)


    def insert_clipping(self, uuid, book_name, author, content, addDate, md5):
        with closing(self.connection_pool.get_connection()) as cnx:
            cursor = cnx.cursor()
            cursor.execute('set global max_allowed_packet=670108864')
            try:
                cursor.execute("begin")
                sql = """INSERT INTO clipping (uuid, book_name, author, content, addDate, md5, stars, create_time) 
                                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s) """
                data_tuple = (
                    uuid,
                    book_name,
                    author,
                    str(content),
                    addDate,
                    md5,
                    0,
                    str(get_now())
                )
                cursor.execute(sql, data_tuple)
                cnx.commit()
                cursor.close()

            except Exception as error:
                cursor.execute("rollback")
                print("Failed to insert clipping. ", error)


db = DB()
