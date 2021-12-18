#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from uuid import uuid1
import hashlib

from ..database.sqlite import db
from ..util.util import convert_to_binary_data


md5_hash = hashlib.md5()


def create_book_collection(name, description, subjects, stars, cover_path):
    uuid = str(uuid1())

    cover_content = None
    extension = None
    if cover_path is not None:
        cover_content = convert_to_binary_data(cover_path)
        extension = os.path.splitext(cover_path)[1]
    db.insert_book_collection(uuid, name, description, subjects, stars, cover_content, extension)
