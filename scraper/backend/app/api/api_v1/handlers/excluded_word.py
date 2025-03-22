from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.schemas.excluded_word_schema import ExcludedWordCreate, ExcludedWordUpdate
from app.services.excluded_word_service import ExcludedWordService

ex_word_router = APIRouter()


@ex_word_router.get("/", summary="Get all excluded words")
async def words(current_user: User = Depends(get_current_user)):
    words = await ExcludedWordService.list_words(current_user)
    return words


@ex_word_router.post("/", summary="Create excluded word")
async def create_word(
    data: ExcludedWordCreate, current_user: User = Depends(get_current_user)
):
    word = await ExcludedWordService.create_word(data, current_user)
    return word


@ex_word_router.put("/{id}", summary="Update excluded word")
async def update_word(
    id: str, data: ExcludedWordUpdate, current_user: User = Depends(get_current_user)
):
    try:
        word = await ExcludedWordService.update_word(id, data, current_user)
        return word.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update",
        )


@ex_word_router.delete("/{id}", summary="Delete excluded word")
async def delete_word(id: str, current_user: User = Depends(get_current_user)):
    await ExcludedWordService.delete_word(id, current_user)
    return {"status": "success"}
