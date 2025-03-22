from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from fastapi import Depends, HTTPException, status
from app.models.user_model import User
from jose import jwt
from app.schemas.auth_scheme import TokenPayload
from datetime import datetime
from pydantic import ValidationError
from app.services.user_service import UserService
from bson import ObjectId
from . import jwt_bearer

# reusable_oauth = OAuth2PasswordBearer(
#     tokenUrl=f"{settings.API_V1_STR}/auth/login",
#     scheme_name="JWT"
# )

reusable_oauth = jwt_bearer.JWTBearer()


async def get_current_user(token: str = Depends(reusable_oauth))-> User:
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=settings.ALGORITHM
        )  
        token_data = TokenPayload(**payload)

        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Token expired',
                headers={"Authorization":"Bearer"},
            )
    
    except(jwt.JWTError, ValidationError):
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='Could not validate credentials',
                headers={"Authorization":"Bearer"},
            )
    
    user = await UserService.get_user_by_id(token_data.subject)
    
    if not user:
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='Could not find user',
            )
    
    return user