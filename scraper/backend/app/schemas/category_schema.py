from pydantic import BaseModel, Field
from typing import Optional, List
from app.models.category_model import Category


class CategoryCreate(BaseModel):
    category: str


class CategoryUpdate(BaseModel):
    category: Optional[str]


class CategoryRemoveSub(BaseModel):
    sub_ids: List[str]


class CategorySearchRequest(BaseModel):
    page: int = Field(1, description="Page number", ge=1)
    per_page: int = Field(20, description="Items per page", ge=1)
    category: str = Field(None, description="Search category")


class PaginatedCategoryResponse(BaseModel):
    total: int
    page: int
    per_page: int
    total_pages: int
    items_count: int
    categories: List[Category]
