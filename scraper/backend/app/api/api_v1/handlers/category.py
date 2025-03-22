from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.schemas.category_schema import (
    CategoryCreate,
    CategoryUpdate,
    CategoryRemoveSub,
    CategorySearchRequest,
)
from app.services.category_service import CategoryService

category_router = APIRouter()


@category_router.get("/", summary="Get all categories")
async def categories(
    paginate: bool = False,
    page: int = Query(1, description="Page number", ge=1),
    per_page: int = Query(20, description="Items per page", ge=1),
    category: str = Query(None, description="Search category"),
    _: User = Depends(get_current_user),
):
    if paginate:
        new_request = CategorySearchRequest(
            page=page, per_page=per_page, category=category
        )
        categories = await CategoryService.list_categories_unpopulated(
            request=new_request
        )
        return categories
    else:
        categories = await CategoryService.list_categories()
        return categories


@category_router.post("/", summary="Create category")
async def create_category(data: CategoryCreate, _: User = Depends(get_current_user)):
    category = await CategoryService.create_category(data)
    return category


@category_router.put("/{id}", summary="Update category")
async def update_category(
    id: str,
    data: CategoryUpdate,
    _: User = Depends(get_current_user),
):
    try:
        category = await CategoryService.update_category(id, data)
        return category.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update",
        )


@category_router.delete("/{id}", summary="Delete category")
async def delete_category(id: str, _: User = Depends(get_current_user)):
    await CategoryService.delete_category(id)
    return {"status": "success"}


@category_router.get("/{id}", summary="Get category")
async def get_category(id: str, _: User = Depends(get_current_user)):
    category = await CategoryService.get_category_by_id(id)
    return category


@category_router.post("/{id}/sub", summary="Add Sub category")
async def add_sub_category(
    id: str, data: CategoryCreate, _: User = Depends(get_current_user)
):
    category = await CategoryService.add_sub_category(id, data)
    return category


@category_router.delete("/{id}/sub", summary="Remove Sub category")
async def remove_sub_category(
    id: str, data: CategoryRemoveSub, _: User = Depends(get_current_user)
):
    category = await CategoryService.remove_sub_category(id, data)
    return category


@category_router.post("/file", summary="Add from file")
async def add_from_category(_: User = Depends(get_current_user)):
    await CategoryService.add_category_file()
    return "success"
