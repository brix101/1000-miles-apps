from pydantic import BaseModel, Field
from typing import Optional


class RoleCreate(BaseModel):
    name: str = Field(..., title='Name')
    active: Optional[bool] = True


class RoleUpdate(BaseModel):
    name: Optional[str]
    active: Optional[bool]
