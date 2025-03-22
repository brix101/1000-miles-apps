from pydantic import BaseModel, Field
from typing import Optional


class CountryCreate(BaseModel):
    name: str = Field(..., title='Name')
    code: str = Field(..., title='Code')
    short_name: str = Field(..., title='Short Name')
    phone_code: str = Field(..., title='Phone Code')
    active: Optional[bool] = True 


class CountryUpdate(BaseModel):
    name: Optional[str] 
    code: Optional[str] 
    short_name: Optional[str] 
    phone_code: Optional[str] 
    active: Optional[bool]