from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from pathlib import Path


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = "postgresql+psycopg2://autograder_user:autograder_pass@127.0.0.1:5432/autograder"
    ALLOW_ADMIN_REGISTRATION: bool = False
    JWT_SECRET: str = "change-me-now"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_MINUTES: int = 60
    
    # Store data relative to the backend folder robustly
    DATA_ROOT: str = str(Path(__file__).parent.parent / "data")
    
    # CORS origins for frontend development
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://orange-waddle-qjjqjjrrg5w3j65-5173.app.github.dev",
        "https://orange-waddle-qjjqjjrrg5w3j65-8000.app.github.dev",
    ]


settings = Settings()