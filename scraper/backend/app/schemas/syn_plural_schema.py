from pydantic import BaseModel, Field
from typing import Optional, List


class SynonymPluralCreate(BaseModel):
    word: str = Field(..., title='Word')
    language: str = Field(..., title='Language')
    synonyms: Optional[List] = []
    plural: Optional[List] = []
    active: Optional[bool] = True


class SynonymPluralUpdate(BaseModel):
    word: Optional[str]
    language: Optional[str]
    synonyms: Optional[List]
    plural: Optional[List]
    active: Optional[bool]


class AddSynoynym(BaseModel):
    synonyms: List


class AddPlural(BaseModel):
    plural: List


class RemoveSynoynymPlural(BaseModel):
    words: List

