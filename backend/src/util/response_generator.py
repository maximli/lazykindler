from flask import Response, json
from datetime import datetime, date


def response_generator(payload, status):
    return Response(response=json.dumps({"payload": payload}), status=status, mimetype='application/json')


# json serializer
def json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    return str(obj)
