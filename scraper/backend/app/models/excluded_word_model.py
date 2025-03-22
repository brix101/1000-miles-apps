from beanie import Document, before_event, Replace, Insert
from pydantic import Field
from datetime import datetime


class ExcludedWord(Document):
    word: str
    active: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def __repr__(self) -> str:
        return self.word

    def __str__(self) -> str:
        return self.word

    def __hash__(self) -> int:
        return hash(self.word)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, ExcludedWord):
            return self.id == other.id
        return False

    @before_event([Replace, Insert])
    def update_updated_at(self):
        self.updated_at = datetime.utcnow()

    class Settings:
        name = "sc_excluded_words"
