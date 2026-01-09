import os


class Config:
    BACKEND_HOST = os.getenv("BACKEND_HOST", "127.0.0.1")
    BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8080"))
    DATABASE_URL = os.getenv("DATABASE_URL")


config = Config()