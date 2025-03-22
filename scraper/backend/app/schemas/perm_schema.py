from pydantic import BaseModel, Field
from typing import Optional


class PermissionCreate(BaseModel):
    name: str = Field(..., title='Name')
    read: Optional[bool] = True
    write: bool = Field(..., title='Write Permission')
    active: Optional[bool] = True


class PermissionUpdate(BaseModel):
    name: Optional[str]
    read: Optional[bool]
    write: Optional[bool]
    active: Optional[bool]