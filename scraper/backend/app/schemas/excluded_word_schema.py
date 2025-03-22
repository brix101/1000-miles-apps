from pydantic import BaseModel, Field
from typing import Optional, List


class ExcludedWordCreate(BaseModel):
    words: Optional[List] = []


class ExcludedWordUpdate(BaseModel):
    name: Optional[str]
    active: Optional[bool]
