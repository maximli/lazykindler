from flask import request
from ..service import comment


def get_comments_of_related_uuid():
    related_uuid = request.args.get('related_uuid')
    return comment.get_comments_of_related_uuid(related_uuid)


def create_comment():
    content = request.json
    related_uuid = content['related_uuid']
    comment_content = content['content']
    return comment.create_comment(related_uuid, comment_content)


def delete_comment():
    uuid = request.args.get('uuid')
    return comment.delete_comment(uuid)


def update_comment():
    content = request.json
    uuid = content['uuid']
    newContent = content['newContent']
    return comment.update_comment(uuid, newContent)
