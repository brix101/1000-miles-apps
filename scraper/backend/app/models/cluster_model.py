from beanie import Document, before_event, Replace, Insert, Link
from pydantic import Field
from datetime import datetime
from typing import Optional, List
from app.models.user_model import User


class Cluster(Document):
    name: Optional[str]
    categories: Optional[List[str]]
    customers: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    active: bool = True
    created_by: Optional[Link[User]]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def __repr__(self) -> str:
        return self.name

    def __str__(self) -> str:
        return self.name

    def __hash__(self) -> int:
        return hash(self.name)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Cluster):
            return self.id == other.id
        return False

    @before_event([Replace, Insert])
    def update_updated_at(self):
        self.updated_at = datetime.utcnow()

    class Settings:
        name = "sc_clusters"
