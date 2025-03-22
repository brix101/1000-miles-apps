from beanie import Document, Indexed, before_event, Replace, Insert, Link
from bson import ObjectId
from pydantic import Field, EmailStr
from datetime import datetime
from typing import Optional, List
from app.models.category_model import Category


class Product(Document):
    image: Optional[str]
    name: Optional[str]
    description: Optional[str]
    price: Optional[float]
    categories: Optional[List[dict]] = []
    tags: Optional[List] = []
    estimated_markup: Optional[float]
    markup: Optional[float]
    review_score: Optional[float]
    review_number: Optional[int]
    active: Optional[bool] = True
    price_usd: Optional[float] = 0
    category: Optional[Link[Category]]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def __repr__(self) -> str:
        return self.name

    def __str__(self) -> str:
        return self.name

    def __hash__(self) -> int:
        return hash(self.name)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Product):
            return self.id == other.id
        return False

    @before_event([Replace, Insert])
    def update_updated_at(self):
        self.updated_at = datetime.utcnow()

    class Settings:
        use_cache = True
        name = "sc_products"
