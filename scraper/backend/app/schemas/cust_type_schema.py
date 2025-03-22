from pydantic import BaseModel, Field
from typing import Optional


class CustomerTypeCreate(BaseModel):
    name: str = Field(..., title='Name')
    active: Optional[bool] = True 


class CustomerTypeUpdate(BaseModel):
    name: Optional[str] 
    active: Optional[bool]