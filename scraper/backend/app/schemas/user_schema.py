from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
from typing import Optional, List
from datetime import datetime


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


class UserAuth(BaseModel):
    email: EmailStr = Field(..., decription="Email")
    password: str = Field(..., min_length=8, description="Password")
    name: str = Field(..., decription="Name")
    status: str = Field(..., decription="Status")
    active: bool = True
    role_id: str
    permission_id: str
    image_url: Optional[str]


class UserUpdate(BaseModel):
    email: Optional[EmailStr]
    password: Optional[str]
    name: Optional[str]
    status: Optional[str]
    active: Optional[bool]
    role_id: Optional[str]
    image_url: Optional[str]
    permission_id: Optional[str]
    updated_at : Optional[datetime] = datetime.utcnow()


class LoginUser(BaseModel):
    email: EmailStr = Field(..., decription="Email")
    password: str = Field(..., min_length=8, description="Password")


class UserBulkDelete(BaseModel):
    ids: List[str] = Field(..., description="List of IDs")
