from pydantic import BaseModel, Field
from typing import Optional


class CurrencyCreate(BaseModel):
    name: str = Field(..., title='Name')
    code: str = Field(..., title='Code')
    symbol: str = Field(..., title='Symbol')
    active: Optional[bool] = True 
    default: Optional[bool] = False
    value: Optional[float] = 0


class CurrencyUpdate(BaseModel):
    name: Optional[str] 
    code: Optional[str] 
    symbol: Optional[str] 
    active: Optional[bool]
    default: Optional[bool]
    value: Optional[float]