from dotenv import load_dotenv
load_dotenv()

from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import status_router, box_router
from .db.database import Base, engine
from .models import BoxModel  # Import models so they're registered with Base
from .config import config


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup
    Base.metadata.create_all(bind=engine)

    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(status_router.router)
app.include_router(box_router.router)


if __name__ == "__main__":
    uvicorn.run(
        app, 
        host=config.BACKEND_HOST, 
        port=config.BACKEND_PORT
    )
