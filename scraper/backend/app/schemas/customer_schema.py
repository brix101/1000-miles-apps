from pydantic import BaseModel, Field
from typing import Optional, List
from app.models.product_model import Product
from datetime import datetime

class CustomerCreate(BaseModel):
    name: str
    type: str
    website: str
    country: str
    currency: str
    language: str
    markup: float
    frequency: str
    require_login: Optional[bool] = False
    username: Optional[str]
    password: Optional[str]
    active: Optional[bool] = True
    spider_name: Optional[str]
    spider_code: Optional[str]
    image_url: Optional[str]


class CustomerUpdate(BaseModel):
    name: Optional[str]
    type: Optional[str]
    website: Optional[str]
    country: Optional[str]
    currency: Optional[str]
    language: Optional[str]
    markup: Optional[float]
    frequency: Optional[str]
    require_login: Optional[bool]
    username: Optional[str]
    password: Optional[str]
    active: Optional[bool]
    spider_name: Optional[str]
    spider_code: Optional[str]
    image_url: Optional[str]
    updated_at : Optional[datetime] = datetime.utcnow()


class CustomerProducts(BaseModel):
    products: Optional[List[Product]]
