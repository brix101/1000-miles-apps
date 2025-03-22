from beanie import Document, Indexed, Link, before_event, Replace, Insert
from bson import ObjectId
from pydantic import Field, EmailStr
from datetime import datetime
from typing import Optional, List
from app.models.cust_type_model import CustomerType
from app.models.country_model import Country
from app.models.currency_model import Currency
from app.models.language_model import Language
from app.models.frequency_model import ScrapingFrequency
from app.models.product_model import Product


class Customer(Document):
    name: str
    type: Link[CustomerType]
    website: str
    country: Link[Country]
    currency: Link[Currency]
    language: Link[Language]
    markup: float
    frequency: Link[ScrapingFrequency]
    require_login: bool
    username: Optional[str]
    password: Optional[str]
    spider_name: Optional[str]
    spider_code: Optional[str]
    image_url: Optional[str]
    products: Optional[List[Link[Product]]] = []
    active: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_scraped: Optional[datetime]
    scrape_status: Optional[str]

    def __repr__(self) -> str:
        return self.name

    def __str__(self) -> str:
        return self.name

    def __hash__(self) -> int:
        return hash(self.name)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Customer):
            return self.id == other.id
        return False

    @before_event([Replace, Insert])
    def update_updated_at(self):
        self.updated_at = datetime.utcnow()

    class Settings:
        name = "sc_customers"
