from beanie import Document, Indexed, Link, before_event, Replace, Insert
from bson import ObjectId
from pydantic import Field, EmailStr
from datetime import datetime
from typing import Optional, List
from app.models.language_model import Language


class SynonymPlural(Document):
    word: str
    language: Link[Language]
    synonyms: Optional[List] = []
    plural: Optional[List] = []
    active: Optional[bool]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def __repr__(self) -> str:
        return self.word

    def __str__(self) -> str:
        return self.word

    def __hash__(self) -> int:
        return hash(self.word)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, SynonymPlural):
            return self.id == other.id
        return False

    @before_event([Replace, Insert])
    def update_updated_at(self):
        self.updated_at = datetime.utcnow()

    class Settings:
        name = "sc_synonym_plural"
