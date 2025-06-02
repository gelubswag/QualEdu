import base64
from typing import Any
from datetime import timezone, timedelta




# General settings
CORS_SETTINGS: dict[str, Any] = {
    'allow_origins': ['*'],
    'allow_credentials': True,
    'allow_methods': ['GET', 'POST', 'DELETE'],
    'allow_headers': ['*'],
}
JWT_ALGORITHMS: list[str] = ['ES256']
RETRIES_COUNT: int = 3
BREAK_BETWEEN_TRIES: int = 1
APP_TIMEZONE: timezone = timezone(timedelta(hours=3))