from app.models.user_model import User
from app.models.country_model import Country
from typing import List
from app.schemas.country_schema import CountryCreate, CountryUpdate
from typing import Optional
from bson import ObjectId

class CountryService:
    @staticmethod
    async def list_countries(user: User) -> List[Country]:
        countries = await Country.find({"active":True}).sort("+short_name").to_list()
        return countries
    
    @staticmethod
    async def create_country(data: CountryCreate, user: User) -> Country:
        country = Country(**data.dict())
        return await country.insert()
    
    @staticmethod
    async def get_country_by_id(id: str) -> Optional[Country]:
        country =await Country.find_one(Country.id == ObjectId(id))
        return country
    
    @staticmethod
    async def update_country(id: str, data: CountryUpdate, current_user: User):
        country = await CountryService.get_country_by_id(id)
        await country.update({"$set": data.dict(exclude_unset=True)})
        await country.save()
        return country
    
    @staticmethod
    async def delete_country(id: str, current_user: User):
        country = await CountryService.get_country_by_id(id)
        await country.update({"$set": {"active": False}})
        await country.save()
        return None