"""Pydantic schemas for admin endpoints (semesters, languages)."""
from datetime import date
from typing import Optional
from pydantic import BaseModel


class SemesterCreate(BaseModel):
    name: str
    start_date: date
    end_date: date
    is_current: bool = False


class SemesterUpdate(BaseModel):
    name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None


class LanguageCreate(BaseModel):
    name: str
    file_extension: Optional[str] = None
    docker_image: Optional[str] = None


class LanguageUpdate(BaseModel):
    name: Optional[str] = None
    file_extension: Optional[str] = None
    docker_image: Optional[str] = None
