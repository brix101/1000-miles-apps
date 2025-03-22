from beanie import Document, Indexed, before_event, Replace, Insert
from bson import ObjectId
from pydantic import Field, EmailStr
from datetime import datetime
from typing import Optional


class CustomerType(Document):
    name: str
    active: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def __repr__(self) -> str:
        return self.name

    def __str__(self) -> str:
        return self.name

    def __hash__(self) -> int:
        return hash(self.name)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, CustomerType):
            return self.id == other.id
        return False

    @before_event([Replace, Insert])
    def update_updated_at(self):
        self.updated_at = datetime.utcnow()

    class Settings:
        name = "sc_custumer_type"
