from app.models.user_model import User
from app.models.perm_model import Permission
from typing import List
from app.schemas.perm_schema import PermissionCreate, PermissionUpdate
from typing import Optional
from bson import ObjectId

class PermissionService:
    @staticmethod
    async def list_permissions(user: User) -> List[Permission]:
        permissions = await Permission.find({"active":True}).to_list()
        return permissions
    
    @staticmethod
    async def create_permission(data: PermissionCreate, user: User) -> Permission:
        permission = Permission(**data.dict())
        return await permission.insert()
    
    @staticmethod
    async def get_permission_by_id(id: str) -> Optional[Permission]:
        permission =await Permission.find_one(Permission.id == ObjectId(id))
        return permission
    
    @staticmethod
    async def update_permission(id: str, data: PermissionUpdate, current_user: User):
        permission = await PermissionService.get_permission_by_id(id)
        await permission.update({"$set": data.dict(exclude_unset=True)})
        await permission.save()
        return permission
    
    @staticmethod
    async def delete_permission(id: str, current_user: User):
        permission = await PermissionService.get_permission_by_id(id)
        await permission.update({"$set": {"active": False}})
        await permission.save()
        return None