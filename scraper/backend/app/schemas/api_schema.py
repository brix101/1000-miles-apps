from pydantic import BaseModel, Field
from typing import Optional


class APICreate(BaseModel):
    name: str = Field(..., title='Name')
    key: str = Field(..., title='Key')
    code: str = Field(..., title='Code')
    note: str = Field(..., title='Note')
    translation: Optional[bool] = False
    synonym: Optional[bool] = False
    plural: Optional[bool] = False
    search: Optional[bool] = False
    active: Optional[bool] = True


class APIUpdate(BaseModel):
    name: Optional[str]
    key: Optional[str]
    code: Optional[str]
    note: Optional[str]
    translation: Optional[bool]
    synonym: Optional[bool]
    plural: Optional[bool]
    search: Optional[bool]
    active: Optional[bool]