from pydantic import BaseSettings, AnyHttpUrl
from decouple import config
from typing import List

class Settings(BaseSettings):
    API_V1_STR : str = "/api/v1"
    JWT_SECRET_KEY: str = config("JWT_SECRET_KEY", cast=str)
    JWT_REFRESH_SECRET_KEY: str = config("JWT_REFRESH_SECRET_KEY", cast=str)
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRATION_MINUTES: int = 60*24*7 #7 Days
    REFRESH_TOKEN_EXPIRATION_MINUTES: int = 60*24*7 #7 Days
    BACKEND_CORS_ORIGINS : List[AnyHttpUrl] = []
    PROJECT_NAME: str = "SCRAPER"
    SCRAPER_API: str = 'http://127.0.0.1:9080'

    #DATABASE
    MONGO_CONNECTION_STRING: str = config("MONGO_CONNECTION_STRING", cast=str)

    class Config:
        case_sensitive = True


settings = Settings()