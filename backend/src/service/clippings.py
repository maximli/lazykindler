#!/usr/bin/env python
# -*- coding: utf-8 -*-

from os import path
import time
import numpy as np
import datetime
import hashlib

from ..util.util import generate_uuid, get_md5
from ..database.sqlite import db

#clipping_path = u'/Volumes/Kindle/documents/My Clippings.txt'
clipping_path = u'/Users/wp/Downloads/My Clippings.txt'

class ClippingHelper(object):
    def __init__(self):
        pass

    def import_clippings(self):
        exists = path.exists(clipping_path)
        if not exists:
            return
        
        file_md5 = get_md5(clipping_path)
        clippings_md5s = db.query("select md5 from clippings_md5")
        if clippings_md5s is not None and len(clippings_md5s) > 0:
            if clippings_md5s[0]['md5'] == file_md5:
                return
            else:
                update_clippings_md5(file_md5)
        else:
            db.insert_clippings_md5(file_md5)

        file = open(clipping_path, 'r')
        lines = file.readlines()

        allLines = []
        for line in lines:
            line = line.strip()
            allLines.append(line)

        arr = np.array(allLines)
        clippings = np.array_split(arr, len(allLines) / 5)

        for clip in clippings:
            self.handle_single_clipping(clip[0], clip[1], clip[3])
        

    def handle_single_clipping(self, title, time_info, clip_content):
        book_name = self.extract_book_name(title)
        author = self.extract_author(title)
        timestamp = self.extract_time(time_info) 

        str_md5 = hashlib.md5(clip_content.encode('utf-8')).hexdigest()

        clips = db.query("select uuid from clipping where md5='{}';".format(str_md5))
        if clips is not None and len(clips) > 0:
            return
        
        db.insert_clipping(generate_uuid(), book_name, author, clip_content, timestamp, str_md5)


    def extract_book_name(self, title):
        index = title.find('(')
        if title.find('（') >= 0:
            index = title.find('（')
        book_name = title[:index].strip()
        return book_name


    def extract_author(self, title):
        return title[title.rfind("(")+1:title.rfind(")")]


    def extract_time(self, time_info):
        index = time_info.find(',')
        str = time_info[index+1:].strip()
        return time.mktime(datetime.datetime.strptime(str, '%d %B %Y %H:%M:%S').timetuple())


def update_clippings_md5(new_md5):
    db.run_sql("update clippings_md5 set md5='{}'".format(
        new_md5))