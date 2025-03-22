from pydantic import BaseModel, Field
from typing import Optional, List


class ProductCreate(BaseModel):
    image: Optional[str]
    name: Optional[str] 
    description: Optional[str]
    price: Optional[float]
    categories: Optional[List[dict]] = []
    tags: Optional[List] = []
    estimated_markup: Optional[float] = 0
    markup: Optional[float] = 0
    review_score: Optional[float] = 0
    review_number: Optional[int] = 0
    active: Optional[bool] = True
    price_usd: Optional[float] = 0
    category: Optional[str]


class ProductUpdate(BaseModel):
    image: Optional[str]
    name: Optional[str] 
    description: Optional[str]
    price: Optional[float]
    categories: Optional[List[dict]]
    tags: Optional[List] = []
    estimated_markup: Optional[float]
    markup: Optional[float]
    review_score: Optional[float] 
    review_number: Optional[int]
    active: Optional[bool]
    price_usd: Optional[float]
    category: Optional[str]
