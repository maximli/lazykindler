# run.py

from src.instance.config import config
from src.instance.flask_app import app
from flask_cors import CORS

if __name__ == '__main__':
    CORS(app)
    app.run(host=config['host_service']['host'],
            port=int(config['host_service']['port']),
            threaded=True,
            debug=True
            )
