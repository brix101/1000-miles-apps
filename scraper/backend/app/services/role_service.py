from app.models.user_model import User
from app.models.role_model import Role
from typing import List
from app.schemas.role_schema import RoleCreate, RoleUpdate
from typing import Optional
from bson import ObjectId

class RoleService:
    @staticmethod
    async def list_roles(user: User) -> List[Role]:
        roles = await Role.find({"active":True}).to_list()
        return roles
    
    @staticmethod
    async def create_role(data: RoleCreate, user: User,) -> Role:
        role = Role(**data.dict())
        return await role.insert()
    
    @staticmethod
    async def get_role_by_id(id: str) -> Optional[Role]:
        role =await Role.find_one(Role.id == ObjectId(id))
        return role
    
    @staticmethod
    async def update_role(id: str, data: RoleUpdate, current_user: User):
        role = await RoleService.get_role_by_id(id)
        await role.update({"$set": data.dict(exclude_unset=True)})
        await role.save()
        return role
    
    @staticmethod
    async def delete_role(id: str, current_user: User):
        role = await RoleService.get_role_by_id(id)
        await role.update({"$set": {"active": False}})
        await role.save()
        return None