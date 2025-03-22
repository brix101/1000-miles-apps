from fastapi import APIRouter, HTTPException, status, Depends, Request
from app.api.dependencies.user_deps import get_current_user
from app.schemas.user_schema import UserAuth, UserUpdate, UserBulkDelete
from app.services.user_service import UserService
from app.services.api_service import APIService
import pymongo
from app.models.user_model import User
from app.services.perm_service import PermissionService
from app.services.role_service import RoleService
from beanie.exceptions import RevisionIdWasChanged
from bson import json_util, ObjectId
from fastapi import status, File, UploadFile, Form
from app.helpers.save_picture import save_picture
from typing import Optional
from pyfa_converter import FormDepends
from typing import List

user_router = APIRouter()


@user_router.post("/", summary="Create New User")
async def create_user(
    data: UserAuth = FormDepends(UserAuth),
    file: UploadFile = File(None),
    current_user: User = Depends(get_current_user),
):
    try:
        if file is not None:
            imageUrl = save_picture(file=file, folderName="users")
            data.image_url = imageUrl
        data = await UserService.create_user(data)
        data = data.dict()
        del data["hashed_password"]
        return data
    except RevisionIdWasChanged:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="user already exist"
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during user creation",
        )


@user_router.get("/{id}", summary="Get User")
async def get_user(
    request: Request, id: str, current_user: User = Depends(get_current_user)
):
    user = await UserService.get_user_by_id(id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    return user.dict()


@user_router.put("/{id}", summary="Update user information")
async def update_user(
    id: str,
    data: UserUpdate = FormDepends(UserUpdate),
    file: UploadFile = File(None),
    current_user: User = Depends(get_current_user),
):
    try:
        if file is not None:
            imageUrl = save_picture(file=file, folderName="users")
            data.image_url = imageUrl
        user = await UserService.update_user(id, data, current_user)
        user = user.dict()
        del user["hashed_password"]
        return user
    except RevisionIdWasChanged:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="email already exist"
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update",
        )


@user_router.delete("/{id}", summary="Delete user")
async def delete_user(id: str, current_user: User = Depends(get_current_user)):
    await UserService.delete_user(id, current_user)
    return {"status": "success"}


@user_router.get("/", summary="Get all users")
async def get_users(current_user: User = Depends(get_current_user)):
    users = await UserService.get_all_users(current_user)
    for i, user in enumerate(users):
        user = user.dict()
        del user["hashed_password"]
        user["role_id"] = dict(user["role_id"])
        user["permission_id"] = dict(user["permission_id"])
        users[i] = user
    return users


@user_router.delete("/", summary="Delete users")
async def delete_user(
    data: UserBulkDelete, current_user: User = Depends(get_current_user)
):
    for id in data.ids:
        await UserService.delete_user(id, current_user)
    return {"status": "success"}
