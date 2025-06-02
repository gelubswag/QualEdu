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

# Импортируем все роутеры
from routers.program_routers import Program_Router
from routers.user_routers import User_Router
from routers.group_routers import Group_Router
from routers.access_routers import Access_Router
from routers.g2p_routers import G2P_Router  # Для связей группа-программа

app = fastapi.FastAPI(
    title='Analytics feedback platform',
    version='0.1'
)

app.add_middleware(
    CORSMiddleware,
    **CORS_SETTINGS,
)

# Включаем все роутеры
app.include_router(Program_Router)
app.include_router(User_Router)
app.include_router(Group_Router)
app.include_router(Access_Router)
app.include_router(G2P_Router)

@app.exception_handler(CustomHTTPError)
async def custom_exception_handler(request, exception: CustomHTTPError):
    return JSONResponse(
        content={
            'status': 'error',
            'detail': exception.detail,
        },
        headers=exception.headers,
        status_code=exception.status_code
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run('app:app', host="0.0.0.0", port=8000, reload=True)