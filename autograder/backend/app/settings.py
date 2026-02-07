from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg2://autograder_user:autograder_pass@localhost:5432/autograder"
    JWT_SECRET: str = "change-me-now"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_MINUTES: int = 60
    DATA_ROOT: str = "data"

settings = Settings()