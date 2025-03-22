from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.models.currency_model import Currency
from app.schemas.currency_schema import CurrencyCreate, CurrencyUpdate
from app.services.currency_service import CurrencyService

currency_router = APIRouter()

@currency_router.get('/', summary='Get all currencies')
async def currencies(current_user: User = Depends(get_current_user)):
    currencies = await CurrencyService.list_currencies(current_user)
    return currencies

@currency_router.post('/', summary='Create currency')
async def create_currency(data: CurrencyCreate, current_user: User = Depends(get_current_user)):
    currency = await CurrencyService.create_currency(data, current_user)
    return currency.dict()

@currency_router.put('/{id}', summary='Update currency')
async def update_currency(id: str, data: CurrencyUpdate, current_user: User = Depends(get_current_user)):
    try:
        currency = await CurrencyService.update_currency(id, data, current_user)
        return currency.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update"
        )

@currency_router.delete('/{id}', summary="Delete currency")
async def delete_currency(id: str, current_user: User = Depends(get_current_user)):
    await CurrencyService.delete_currency(id, current_user)
    return {"status": "success"}