from app.models.user_model import User
from app.models.frequency_model import ScrapingFrequency
from typing import List
from app.schemas.frequency_schema import FrequencyCreate, FrequencyCreate
from typing import Optional
from bson import ObjectId

class FrequencyService:
    @staticmethod
    async def list_frequency(user: User) -> List[ScrapingFrequency]:
        frequencies = await ScrapingFrequency.find({"active":True}).to_list()
        return frequencies
    
    @staticmethod
    async def create_frequency(data: FrequencyCreate, user: User) -> ScrapingFrequency:
        frquency = ScrapingFrequency(**data.dict())
        return await frquency.insert()
    
    @staticmethod
    async def get_frequency_type_by_id(id: str) -> Optional[ScrapingFrequency]:
        frquency =await ScrapingFrequency.find_one(ScrapingFrequency.id == ObjectId(id))
        return frquency
    
    @staticmethod
    async def update_frequency_type(id: str, data: FrequencyCreate, current_user: User):
        frquency = await FrequencyService.get_frequency_type_by_id(id)
        await frquency.update({"$set": data.dict(exclude_unset=True)})
        await frquency.save()
        return frquency
    
    @staticmethod
    async def delete_frequency_type(id: str, current_user: User):
        frquency = await FrequencyService.get_frequency_type_by_id(id)
        await frquency.update({"$set": {"active": False}})
        await frquency.save()
        return None