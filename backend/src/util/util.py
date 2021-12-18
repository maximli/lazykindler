from datetime import datetime
from flask import jsonify
import hashlib


def handle_error(err_msg):
    status_code = 500
    success = False
    response = {
        'success': success,
        'error': {
            'message': err_msg
        }
    }

    return jsonify(response), status_code

def convert_to_binary_data(filename):
    # Convert digital data to binary format
    with open(filename, 'rb') as file:
        blob_data = file.read()
    return blob_data


def get_md5(filepath):
    md5_hash = hashlib.md5()
    with open(filepath,"rb") as f:
        # Read and update hash in chunks of 4K
        for byte_block in iter(lambda: f.read(4096),b""):
            md5_hash.update(byte_block)
        return md5_hash.hexdigest()


def get_now():
    from datetime import datetime
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")