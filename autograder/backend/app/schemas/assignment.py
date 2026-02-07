from pydantic import BaseModel

class AssignmentCreate(BaseModel):
    title: str
    description: str | None = None
