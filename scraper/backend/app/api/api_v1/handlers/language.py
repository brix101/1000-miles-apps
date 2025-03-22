from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.models.language_model import Language
from app.schemas.language_schema import LanguageCreate, LanguageUpdate
from app.services.language_service import LanguageService

language_router = APIRouter()

@language_router.get('/', summary='Get all languages')
async def languages(current_user: User = Depends(get_current_user)):
    languages =  await LanguageService.list_languages(current_user)
    return languages

@language_router.post('/', summary='Create language')
async def create_language(data: LanguageCreate, current_user: User = Depends(get_current_user)):
    language = await LanguageService.create_language(data, current_user)
    return language.dict()

@language_router.put('/{id}', summary='Update language')
async def update_language(id: str, data: LanguageUpdate, current_user: User = Depends(get_current_user)):
    try:
        language = await LanguageService.update_language(id, data, current_user)
        return language.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update"
        )

@language_router.delete('/{id}', summary="Delete language")
async def delete_language(id: str, current_user: User = Depends(get_current_user)):
    await LanguageService.delete_language(id, current_user)
    return {"status": "success"}