"""
Initializes a FastAPI application.
"""


from contextlib import asynccontextmanager

import fastapi
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import utils
import dao
from routers.creds_routers import 
from exceptions import CustomHTTPError
from settings import CORS_SETTINGS


@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    await utils.setup_logging()

app = fastapi.FastAPI(
    title='Order Gateway API',
    version='0.1',
    lifespan=lifespan,
)


@app.exception_handler(CustomHTTPError)
async def custom_exception_handler(request, exception: CustomHTTPError):
    return JSONResponse(
        content={
            'status': 'error',
            'detail': exception.detail,
        },
        status_code=exception.status_code,
        headers=exception.headers,
    )

app.add_middleware(
    CORSMiddleware,
    **CORS_SETTINGS,
)

app.include_router()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run('app:app', reload=True)
