from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg2://autograder_user:autograder_pass@localhost:5432/autograder"
    JWT_SECRET: str = "change-me-now"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_MINUTES: int = 60
    DATA_ROOT: str = "data"

    # CORS origins for frontend development
    CORS_ORIGINS: List[str] = [
        "http://localhost:5174",
        "http://localhost:5173",
        "https://crispy-winner-6qqgqq66wpxf4jrp-5173.app.github.dev",
        "https://crispy-winner-6qqgqq66wpxf4jrp-5175.app.github.dev",
    ]


settings = Settings()