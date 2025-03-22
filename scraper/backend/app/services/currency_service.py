from app.models.user_model import User
from app.models.currency_model import Currency
from typing import List
from app.schemas.currency_schema import CurrencyCreate, CurrencyUpdate
from typing import Optional
from bson import ObjectId


class CurrencyService:
    @staticmethod
    async def list_currencies(user: User) -> List[Currency]:
        currencies = await Currency.find({"active": True}).sort("+code").to_list()
        return currencies

    @staticmethod
    async def create_currency(data: CurrencyCreate, user: User) -> Currency:
        currency = Currency(**data.dict())
        return await currency.insert()

    @staticmethod
    async def get_currency_by_id(id: str) -> Optional[Currency]:
        currency = await Currency.find_one(Currency.id == ObjectId(id))
        return currency

    @staticmethod
    async def update_currency(id: str, data: CurrencyUpdate, current_user: User):
        currency = await CurrencyService.get_currency_by_id(id)
        await currency.update({"$set": data.dict(exclude_unset=True)})
        await currency.save()
        return currency

    @staticmethod
    async def delete_currency(id: str, current_user: User):
        currency = await CurrencyService.get_currency_by_id(id)
        await currency.update({"$set": {"active": False}})
        await currency.save()
        return None
