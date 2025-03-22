from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.models.api_model import API
from app.schemas.api_schema import APICreate, APIUpdate
from app.services.api_service import APIService

api_router = APIRouter()


@api_router.get("/", summary="Get all API")
async def all_api(current_user: User = Depends(get_current_user)):
    apis = await APIService.list_api(current_user)
    return apis


@api_router.post("/", summary="Create API")
async def create_api(data: APICreate, current_user: User = Depends(get_current_user)):
    api = await APIService.create_api(data, current_user)
    return api.dict()


@api_router.put("/{id}", summary="Update API")
async def update_api(
    id: str, data: APIUpdate, current_user: User = Depends(get_current_user)
):
    try:
        api = await APIService.update_api(id, data, current_user)
        return api.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update",
        )


@api_router.delete("/{id}", summary="Delete API")
async def delete_api(id: str, current_user: User = Depends(get_current_user)):
    await APIService.delete_api(id, current_user)
    return {"status": "success"}
