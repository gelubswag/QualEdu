import logging
from typing import Annotated, Literal
import io

import fastapi
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials

import auth
import utils
from exceptions import CustomHTTPError

log: logging.Logger = logging.getLogger('lables_logic')

LablesLogicRouter = fastapi.APIRouter(
    prefix='/creds',
    tags=['creds']
)