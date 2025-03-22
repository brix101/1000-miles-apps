from beanie import Document, Indexed, Link
from bson import ObjectId
from pydantic import Field, EmailStr
from datetime import datetime
from typing import Optional
from app.models.role_model import Role
from app.models.perm_model import Permission


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class User(Document):
    name: str
    email: Indexed(EmailStr, unique=True)
    hashed_password: str
    status: str
    active: bool
    role_id: Link[Role]
    permission_id: Link[Permission]
    image_url: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}

    def __repr__(self) -> str:
        return f"<User {self.email}>"

    def __str__(self) -> str:
        return self.email

    def __hash__(self) -> int:
        return hash(self.email)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, User):
            return self.email == other.email
        return False

    @property
    def create(self) -> datetime:
        return self.id.generation_time

    @classmethod
    async def by_email(self, email: str) -> "User":
        return await self.find_one(self.email == email)

    class Settings:
        name = "sc_users"
