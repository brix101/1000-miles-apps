from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.models.perm_model import Permission
from app.schemas.perm_schema import PermissionCreate, PermissionUpdate
from app.services.perm_service import PermissionService

perm_router = APIRouter()

@perm_router.get('/', summary='Get all permissions')
async def permissions(current_user: User = Depends(get_current_user)):
    permissions =  await PermissionService.list_permissions(current_user)
    return permissions

@perm_router.post('/', summary='Create permission')
async def create_permission(data: PermissionCreate, current_user: User = Depends(get_current_user)):
    permission = await PermissionService.create_permission(data, current_user)
    return permission.dict()

@perm_router.put('/{id}', summary='Update permission')
async def update_permission(id: str, data: PermissionUpdate, current_user: User = Depends(get_current_user)):
    try:
        permission = await PermissionService.update_permission(id, data, current_user)
        return permission.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update"
        )

@perm_router.delete('/{id}', summary="Delete permission")
async def delete_permission(id: str, current_user: User = Depends(get_current_user)):
    await PermissionService.delete_permission(id, current_user)
    return {"status": "success"}