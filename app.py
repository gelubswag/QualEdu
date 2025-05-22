"""
Initializes a FastAPI application.
"""


from contextlib import asynccontextmanager

import fastapi
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import utils
import dao
from exceptions import CustomHTTPError
from settings import CORS_SETTINGS

from routers.creds_routers import Creds_Router

app = fastapi.FastAPI(
    title='Analitics feedback platform',
    version='0.1'
)

app.add_middleware(
    CORSMiddleware,
    **CORS_SETTINGS,
)


app.include_router(Creds_Router)


@app.exception_handler(CustomHTTPError)
async def custom_exception_handler(request, exception: CustomHTTPError):
    return JSONResponse(
        content={
            'status': 'error',
            'detail': exception.detail,
        },
        headers=exception.headers,
    )



if __name__ == "__main__":
    import uvicorn

    uvicorn.run('app:app', reload=True)
