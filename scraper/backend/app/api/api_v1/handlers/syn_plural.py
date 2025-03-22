from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.models.syn_plural_model import SynonymPlural
from app.schemas.syn_plural_schema import SynonymPluralCreate, SynonymPluralUpdate, AddPlural, AddSynoynym, RemoveSynoynymPlural
from app.services.syn_plural_service import SynonymPluralService

syn_plural_router = APIRouter()

@syn_plural_router.get('/', summary='Get all synoyms and plurals')
async def synonym_plural(current_user: User = Depends(get_current_user)):
    syn_plural = await SynonymPluralService.list_synonym_plural(current_user)
    return syn_plural

@syn_plural_router.post('/', summary='Create synonym and plural')
async def create_synonym_plural(data: SynonymPluralCreate, current_user: User = Depends(get_current_user)):
    syn_plural =  await SynonymPluralService.create_synonym_plural(data, current_user)
    return syn_plural.dict()

@syn_plural_router.put('/{id}', summary='Update synoym and plural')
async def update_synonym_plural(id: str, data: SynonymPluralUpdate, current_user: User = Depends(get_current_user)):
    try:
        syn_plural =  await SynonymPluralService.update_synonym_plural(id, data, current_user)
        return syn_plural.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update"
        )

@syn_plural_router.delete('/{id}', summary="Delete synonym and plural")
async def delete_synonym_plural(id: str, current_user: User = Depends(get_current_user)):
    await SynonymPluralService.delete_synonym_plural(id, current_user)
    return {"status": "success"}

@syn_plural_router.post('/synonyms/{id}', summary="Add Synonyms")
async def add_synonym(id: str, data: AddSynoynym, current_user: User = Depends(get_current_user)):
    try:
        syn_plural =  await SynonymPluralService.add_synonyms(id, data, current_user)
        return syn_plural.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update"
        )
    

@syn_plural_router.post('/plurals/{id}', summary="Add Plurals")
async def add_plurals(id: str, data: AddPlural, current_user: User = Depends(get_current_user)):
    try:
        syn_plural =  await SynonymPluralService.add_plural(id, data, current_user)
        return syn_plural.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update"
        )
    
@syn_plural_router.delete('/synonyms/{id}', summary="Remove Synonyms")
async def delete_synonyms(id: str, data:RemoveSynoynymPlural, current_user: User = Depends(get_current_user)):
    synonyms = await SynonymPluralService.delete_synonym(id, data, current_user)
    return synonyms.dict()

@syn_plural_router.delete('/plurals/{id}', summary="Remove Plurals")
async def delete_plurals(id: str, data: RemoveSynoynymPlural, current_user: User = Depends(get_current_user)):
    plural = await SynonymPluralService.delete_plural(id, data, current_user)
    return plural.dict()
