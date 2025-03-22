from pydantic import BaseModel
from typing import Optional, List


class ClusterCreate(BaseModel):
    name: Optional[str]
    categories: Optional[List[str]] = []
    customers: Optional[List[str]] = []
    tags: Optional[List[str]] = []


class ClusterUpdate(BaseModel):
    name: Optional[str]
    categories: Optional[List[str]]
    customers: Optional[List[str]]
    tags: Optional[List[str]]
