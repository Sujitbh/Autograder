from fastapi import FastAPI
from app.core.database import Base, engine
from app.api.routes import auth

app = FastAPI(title="Autograder API")

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)

@app.get("/health")
def health():
    return {"status": "ok"}

