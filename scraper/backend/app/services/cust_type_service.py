from app.models.user_model import User
from app.models.cust_type_model import CustomerType
from typing import List
from app.schemas.cust_type_schema import CustomerTypeCreate, CustomerTypeUpdate
from typing import Optional
from bson import ObjectId

class CustomerTypeService:
    @staticmethod
    async def list_customer_type(user: User) -> List[CustomerType]:
        countries = await CustomerType.find({"active":True}).to_list()
        return countries
    
    @staticmethod
    async def create_customer_type(data: CustomerTypeCreate, user: User) -> CustomerType:
        country = CustomerType(**data.dict())
        return await country.insert()
    
    @staticmethod
    async def get_customer_type_by_id(id: str) -> Optional[CustomerType]:
        country =await CustomerType.find_one(CustomerType.id == ObjectId(id))
        return country
    
    @staticmethod
    async def update_customer_type(id: str, data: CustomerTypeUpdate, current_user: User):
        country = await CustomerTypeService.get_customer_type_by_id(id)
        await country.update({"$set": data.dict(exclude_unset=True)})
        await country.save()
        return country
    
    @staticmethod
    async def delete_customer_type(id: str, current_user: User):
        country = await CustomerTypeService.get_customer_type_by_id(id)
        await country.update({"$set": {"active": False}})
        await country.save()
        return None