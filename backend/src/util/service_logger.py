import logging.handlers
import os

from ..instance.config import config


def __setup_logger(filename):
    dev = True
    if dev:
        log_location = './logs/'
    else:
        try:
            log_location = os.environ['log_path'] + '/'
        except Exception as ex:
            print('please setup env variable log_path')
            exit(1)

    # logfile settings
    log_format = "%(asctime)s [%(levelname)-5.5s] %(message)s"
    log_path = log_location

    progress_logger = logging.getLogger(filename)
    progress_logger.setLevel(logging.DEBUG)

    filepath = log_path + filename
    retaining_handler = logging.handlers.RotatingFileHandler(filepath,
                                                             maxBytes=(1048576 * 5), backupCount=7)
    # log file handler
    log_formatter = logging.Formatter(log_format)
    retaining_handler.setFormatter(log_formatter)
    progress_logger.addHandler(retaining_handler)
    retaining_handler.setLevel(logging.INFO)

    # console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(log_formatter)
    progress_logger.addHandler(console_handler)
    console_handler.setLevel(logging.INFO)
    return progress_logger


log_file = config['host_service']['name'] + ".log"
serviceLogger = __setup_logger(log_file)
