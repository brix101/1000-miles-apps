from app.models.user_model import User
from app.models.language_model import Language
from typing import List
from app.schemas.language_schema import LanguageCreate, LanguageUpdate
from typing import Optional
from bson import ObjectId

class LanguageService:
    @staticmethod
    async def list_languages(user: User) -> List[Language]:
        currencies = await Language.find({"active":True}).sort("+name").to_list()
        return currencies
    
    @staticmethod
    async def create_language(data: LanguageCreate, user: User) -> Language:
        currency = Language(**data.dict())
        return await currency.insert()
    
    @staticmethod
    async def get_language_by_id(id: str) -> Optional[Language]:
        currency =await Language.find_one(Language.id == ObjectId(id))
        return currency
    
    @staticmethod
    async def update_language(id: str, data: LanguageUpdate, current_user: User):
        currency = await LanguageService.get_language_by_id(id)
        await currency.update({"$set": data.dict(exclude_unset=True)})
        await currency.save()
        return currency
    
    @staticmethod
    async def delete_language(id: str, current_user: User):
        currency = await LanguageService.get_language_by_id(id)
        await currency.update({"$set": {"active": False}})
        await currency.save()
        return None