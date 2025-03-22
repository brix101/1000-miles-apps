from pydantic import BaseModel, Field
from typing import Optional


class LanguageCreate(BaseModel):
    name: str = Field(..., title='Name')
    code: str = Field(..., title='Code')
    default: Optional[bool] = False
    active: Optional[bool] = True 


class LanguageUpdate(BaseModel):
    name: Optional[str] 
    code: Optional[str] 
    active: Optional[bool]
    default: Optional[bool]