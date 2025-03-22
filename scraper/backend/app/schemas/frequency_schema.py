from pydantic import BaseModel, Field
from typing import Optional


class FrequencyCreate(BaseModel):
    name: str = Field(..., title='Name')
    days: int = Field(..., title='Number of days')
    active: Optional[bool] = True 


class FrequencyUpdate(BaseModel):
    name: Optional[str] 
    days: Optional[int]
    active: Optional[bool]