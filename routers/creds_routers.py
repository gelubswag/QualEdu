import logging
from typing import Annotated, Literal
import io

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials

import auth
import utils
from exceptions import CustomHTTPError

from db.engine import SessionLocal
from db.models import User

from db.validation import UserCreate


log: logging.Logger = logging.getLogger('lables_logic')

Creds_Router = APIRouter(
    prefix='/creds',
    tags=['creds']
)

def get_db():
    with SessionLocal() as session:
        yield session

@Creds_Router.post('/create_user/')
def create_user(user = Depends(UserCreate()), db = Depends(get_db)):
    new_user = user(
        user_name = UserCreate.user_name,
        
        )