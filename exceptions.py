"""
Provides custom exception classes for handling specific scenarios in
the application.
"""


import fastapi


class CustomHTTPError(Exception):
    """
    Custom exception class for representing HTTP errors with
    additional payload.
    """
    def __init__(
        self,
        status_code: fastapi.status,
        detail: str,
        headers: dict[str, str] = None,
    ):
        self.status_code = status_code
        self.detail = detail
        self.headers = headers


class CriticalError(Exception):
    """
    Wrapper for critical errors. Used to separate processed and logged
    errors from unexpected ones.
    """
    pass


class AuthError(Exception):
    """
    A wrapper for errors related to authentication on external resources.
    """
    pass
