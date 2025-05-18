

import os
import uuid
import asyncio
import json
import logging.config
from functools import wraps
from datetime import datetime, time

from settings import APP_TIMEZONE


async def setup_logging():
    if not os.path.exists('logs'):
        os.makedirs('logs')
    with open('log_conf.json', 'r') as f:
        config = json.load(f)
    logging.config.dictConfig(config)

def generate_req_id() -> str:
    """
    Generates a uuid token and returns its first 16 characters as
    a string.
    """
    return str(uuid.uuid4())[:16]

def run_in_thread(func):
    """
    Decorator for asynchronous call.
    """
    @wraps(func)
    async def wrapper(*args, **kwargs):
        return await asyncio.to_thread(func, *args, **kwargs)
    return wrapper

def generate_temp_campaign_id() -> str:
    """
    Generates a uuid token and returns its first 16 characters as
    a string.
    """
    return 'temp:' + str(uuid.uuid4())[:8]

def from_req_dt(dt_string: str) -> datetime:
    FORMAT: str = '%Y-%m-%d'
    return datetime.strptime(dt_string, FORMAT).date()

def calc_time_to(dt: datetime | None) -> str:
    if not dt:
        return ''

    assert isinstance(dt, datetime)
    # prepare relative values
    noon: time = time(12)
    deadline = datetime.combine(dt.date(), noon)
    current_time = datetime.now(APP_TIMEZONE)

    seconds: float = deadline.timestamp() - current_time.timestamp()
    sign: str = '-' if seconds < 0 else ''
    seconds = abs(seconds)
    days, remainder = divmod(seconds, 86_400)
    hours, remainder = divmod(remainder, 3600)
    minutes, seconds = divmod(remainder, 60)
    return (
        sign
        + (f'{int(days)}д ' if days else '')
        + (f'{int(hours)}ч ' if days or hours else '')
        + f'{int(minutes)}мин'
    )