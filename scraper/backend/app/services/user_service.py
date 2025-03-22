from app.schemas.user_schema import UserAuth, UserUpdate
from app.models.user_model import User
from app.core.security import get_password, verify_password
from typing import Optional
from bson import ObjectId
from app.services.role_service import RoleService
from app.services.perm_service import PermissionService
from typing import List


class UserService:
    @staticmethod
    async def create_user(user: UserAuth):
        role = await RoleService.get_role_by_id(user.role_id)
        permission = await PermissionService.get_permission_by_id(user.permission_id)

        user_in = User(
            email=user.email,
            hashed_password=get_password(user.password),
            name=user.name,
            status=user.status,
            active=True,
            role_id=role,
            permission_id=permission,
            image_url=user.image_url,
        )
        await user_in.save()
        return user_in

    @staticmethod
    async def authenticate(email: str, password: str) -> Optional[User]:
        user = await UserService.get_user_by_email(email=email)
        if not user:
            return None
        if not verify_password(password=password, hashed_password=user.hashed_password):
            return None

        return user

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        user = await User.find_one(User.email == email, User.active == True, fetch_links=True)
        return user

    @staticmethod
    async def get_user_by_id(id: str) -> Optional[User]:
        user = await User.find_one(User.id == ObjectId(id), fetch_links=True)
        return user

    @staticmethod
    async def update_user(id: str, data: UserUpdate, current_user: User):
        user = await UserService.get_user_by_id(id)
        data = data.dict(exclude_unset=True, exclude_none=True)
        data = {k: v for k, v in data.items() if v}
        if "password" in data:
            data["hashed_password"] = get_password(data["password"])
            del data["password"]
        if "role_id" in data:
            role = await RoleService.get_role_by_id(data["role_id"])
            data["role_id"] = role
        if "permission_id" in data:
            permission = await PermissionService.get_permission_by_id(
                data["permission_id"]
            )
            data["permission_id"] = permission

        await user.update({"$set": data})
        await user.save()
        return user

    @staticmethod
    async def delete_user(id: str, current_user: User):
        user = await UserService.get_user_by_id(id)
        await user.update({"$set": {"active": False}})
        await user.save()
        return None

    @staticmethod
    async def get_all_users(current_user: User):
        users = (
            await User.find({"active": True}, fetch_links=True).sort("+name").to_list()
        )
        return users
