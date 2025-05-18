

import logging
from datetime import datetime, timedelta
from typing import Any

import sqlalchemy

import utils

from settings import (RETRIES_COUNT,
                      BREAK_BETWEEN_TRIES
)
from exceptions import CriticalError


POSTGRES_client = sqlalchemy.create_engine

log: logging.Logger = logging.getLogger('dao')


@utils.run_in_thread
