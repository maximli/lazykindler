# run.py

from src.instance.config import config
from src.instance.flask_app import app
from src.util.service_logger import serviceLogger as logger
from flask_cors import CORS

if __name__ == '__main__':
    logger.info("service started at {}:{}".format(config['host_service']['host'],
                                                  config['host_service']['port']
                                                  ))

    CORS(app)
    app.run(host=config['host_service']['host'],
            port=int(config['host_service']['port']),
            threaded=True,
            debug=True
            )
