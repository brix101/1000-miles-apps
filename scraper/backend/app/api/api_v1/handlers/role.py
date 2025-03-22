from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.models.role_model import Role
from app.schemas.role_schema import RoleCreate, RoleUpdate
from app.services.role_service import RoleService

role_router = APIRouter()

@role_router.get('/', summary='Get all user roles')
async def roles(current_user: User = Depends(get_current_user)):
    roles = await RoleService.list_roles(current_user)
    return roles

@role_router.post('/', summary='Create role')
async def create_role(data: RoleCreate, current_user: User = Depends(get_current_user)):
    role =  await RoleService.create_role(data, current_user)
    return role.dict()

@role_router.put('/{id}', summary='Update role')
async def update_role(id: str, data: RoleUpdate, current_user: User = Depends(get_current_user)):
    try:
        role =  await RoleService.update_role(id, data, current_user)
        return role.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update"
        )

@role_router.delete('/{id}', summary="Delete role")
async def delete_role(id: str, current_user: User = Depends(get_current_user)):
    await RoleService.delete_role(id, current_user)
    return {"status": "success"}
