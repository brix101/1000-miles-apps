from beanie import Document, before_event, Replace, Insert
from pydantic import Field
from datetime import datetime
from beanie import Document, Link, before_event, Replace, Insert
from typing import List, Optional


class Category(Document):
    category: str
    active: bool = True
    level: int = 1
    classification: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    sub: Optional[List[Link["Category"]]] = Field(default_factory=list)

    def __repr__(self) -> str:
        return self.category

    def __str__(self) -> str:
        return self.category

    def __hash__(self) -> int:
        return hash(self.category)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Category):
            return self.id == other.id
        return False

    @before_event([Replace, Insert])
    def update_updated_at(self):
        self.updated_at = datetime.utcnow()

    class Settings:
        name = "sc_categories"
