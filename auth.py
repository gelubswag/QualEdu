"""
The module defines authentication and authorization tools.
"""


import logging
from enum import Enum
from typing import Optional

import pydantic
import jwt
import fastapi
from jwt.exceptions import PyJWTError, ExpiredSignatureError
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

import dao
from exceptions import CustomHTTPError
from settings import JWT_ALGORITHMS, JWT_PUBLIC_KEY


log: logging.Logger = logging.getLogger('app')

BearerScheme = HTTPBearer(auto_error=False)


class JWTTypeEnum(Enum):
    """
    JSON web token types.
    """
    CLIENT = 'web'
    SERVICE = 'service'


class JWTPayload(pydantic.BaseModel):
    """
    The payload structure expected in the JWT.
    """
    use: JWTTypeEnum
    sub: Optional[str] = None
    jti: Optional[str] = None
    exp: Optional[int] = None

    @pydantic.model_validator(mode='before')
    @classmethod
    def check_sub_or_jti(cls, values):
        """
        Checks whether at least one of the `sub` or `jti` claims is defined.
        """
        if 'sub' not in values and 'jti' not in values:
            raise AssertionError('Token should have either sub or jti claim')
        return values

    @pydantic.model_validator(mode='after')
    def check_client_sub(self):
        """
        Checks if `sub` claim is defined in the client token.
        """
        if self.use == JWTTypeEnum.CLIENT and self.sub is None:
            raise AssertionError('Client token should have `sub` claim')
        return self

    @pydantic.model_validator(mode='after')
    def check_service_jti(self):
        """
        Checks if `jti` claim is defined in the service token.
        """
        if self.use == JWTTypeEnum.SERVICE and self.jti is None:
            raise AssertionError('Service token should have `jti` claim')
        return self
    

async def check_client(
    authorization: HTTPAuthorizationCredentials | None,
    space_id: int,
    req_id: str,
) -> int:
    if authorization is None:
        log.info('unauthorized. req_id: %s', req_id)
        raise CustomHTTPError(
            fastapi.status.HTTP_401_UNAUTHORIZED,
            'Unauthorized',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    payload: JWTPayload = await _extract_payload(authorization, req_id)
    if payload.use == JWTTypeEnum.SERVICE:
        log.info('wrong token. req_id: %s', req_id)
        raise CustomHTTPError(
            fastapi.status.HTTP_403_FORBIDDEN,
            'Service token passed, client token needed',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    client_id = int(payload.sub)
    if await dao.check_client_space(client_id, space_id):
        return client_id
    else:
        raise CustomHTTPError(
            fastapi.status.HTTP_400_BAD_REQUEST,
            'Access to the specified space is denied',
        )


async def check_service(
    authorization: HTTPAuthorizationCredentials | None,
    req_id: str,
) -> int:
    if authorization is None:
        log.info('unauthorized. req_id: %s', req_id)
        raise CustomHTTPError(
            fastapi.status.HTTP_401_UNAUTHORIZED,
            'Unauthorized',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    payload: JWTPayload = await _extract_payload(authorization, req_id)
    if payload.use == JWTTypeEnum.CLIENT:
        log.info('wrong token. req_id: %s', req_id)
        raise CustomHTTPError(
            fastapi.status.HTTP_403_FORBIDDEN,
            'Client token passed, service token needed',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    dev_id = int(payload.jti)
    if await dao.check_dev_token(dev_id):
        return dev_id
    else:
        raise CustomHTTPError(
            fastapi.status.HTTP_400_BAD_REQUEST,
            'Access denied',
        )


async def _extract_payload(
    authorization: HTTPAuthorizationCredentials,
    req_id: str,
) -> JWTPayload:
    token: str = authorization.credentials
    try:
        data = jwt.decode(token, JWT_PUBLIC_KEY, JWT_ALGORITHMS)
    except ExpiredSignatureError:
        log.info('token expired. req_id: %s', req_id)
        raise CustomHTTPError(
            fastapi.status.HTTP_401_UNAUTHORIZED,
            'Token expired',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    except PyJWTError:
        log.info('invalid token. req_id: %s', req_id)
        raise CustomHTTPError(
            fastapi.status.HTTP_401_UNAUTHORIZED,
            'Invalid token',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    try:
        return JWTPayload(**data)
    except pydantic.ValidationError:
        log.exception('token validation error. req_id: %s', req_id)
        raise CustomHTTPError(
            fastapi.status.HTTP_401_UNAUTHORIZED,
            'Invalid token',
            headers={'WWW-Authenticate': 'Bearer'},
        )
