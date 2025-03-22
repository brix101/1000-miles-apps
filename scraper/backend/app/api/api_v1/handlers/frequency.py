from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.models.frequency_model import ScrapingFrequency
from app.schemas.frequency_schema import FrequencyCreate, FrequencyUpdate
from app.services.frequency_service import FrequencyService

frequency_router = APIRouter()

@frequency_router.get('/', summary='Get all scraping frequency')
async def frequencies(current_user: User = Depends(get_current_user)):
    frequencies = await FrequencyService.list_frequency(current_user)
    return frequencies 

@frequency_router.post('/', summary='Create scraping frequency')
async def create_frequency(data: FrequencyCreate, current_user: User = Depends(get_current_user)):
    frequency =  await FrequencyService.create_frequency(data, current_user)
    return frequency.dict()

@frequency_router.put('/{id}', summary='Update scraping frequency')
async def update_frequency(id: str, data: FrequencyUpdate, current_user: User = Depends(get_current_user)):
    try:
        frequency = await FrequencyService.update_frequency_type(id, data, current_user)
        return frequency.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update"
        )

@frequency_router.delete('/{id}', summary="Delete scraping frequency")
async def delete_frequency(id: str, current_user: User = Depends(get_current_user)):
    await FrequencyService.delete_frequency_type(id, current_user)
    return {"status": "success"}