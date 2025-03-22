from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.models.country_model import Country
from app.schemas.country_schema import CountryCreate, CountryUpdate
from app.services.country_service import CountryService

country_router = APIRouter()

@country_router.get('/', summary='Get all countries')
async def countries(current_user: User = Depends(get_current_user)):
    countries = await CountryService.list_countries(current_user)
    return countries

@country_router.post('/', summary='Create country')
async def create_country(data: CountryCreate, current_user: User = Depends(get_current_user)):
    country = await CountryService.create_country(data, current_user)
    return country.dict()

@country_router.put('/{id}', summary='Update country')
async def update_country(id: str, data: CountryUpdate, current_user: User = Depends(get_current_user)):
    try:
        country = await CountryService.update_country(id, data, current_user)
        return country.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update"
        )

@country_router.delete('/{id}', summary="Delete country")
async def delete_country(id: str, current_user: User = Depends(get_current_user)):
    await CountryService.delete_country(id, current_user)
    return {"status": "success"}