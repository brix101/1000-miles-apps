from fastapi import APIRouter, Depends, HTTPException, status, Body, Response
from typing import Any
from app.services.user_service import UserService
from app.core.security import create_access_token, create_refresh_token
from app.schemas.auth_scheme import TokenSchema
from app.models.user_model import User
from app.api.dependencies.user_deps import get_current_user
from app.core.config import settings
from datetime import datetime
from app.schemas.auth_scheme import TokenPayload
from app.services.user_service import UserService
from app.schemas.user_schema import LoginUser


auth_router = APIRouter()

@auth_router.post('/login', summary='Authenticate user')
async def login(response: Response, data: LoginUser) -> Any:
    user = await UserService.authenticate(email=data.email, password=data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Incorrect email or password'
        )
    access = create_access_token(user.id)
    response.headers["Authorization"] = f"Bearer {access}"
    data = user.dict()
    del data['hashed_password']
    return {
        "user": data,
        "access_token": access
    }

@auth_router.get('/me', summary='Get Current User')
async def test_token(user: User = Depends(get_current_user)):
    data = user.dict()
    del data['hashed_password']

    return data

# @auth_router.post('/refresh', summary="Refresh Token", response_model=TokenSchema)
# async def refresh_token(refresh_token: str = Body(...)):
#     try:
#         payload = jwt.decode(
#             refresh_token, settings.JWT_REFRESH_SECRET_KEY, algorithms=[settings.ALGORITHM]
#         )  
#         token_data = TokenPayload(**payload)

#     except(jwt.JWTError, ValidationError):
#         raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail='Invalid Token',
#                 headers={"WWW-Authenticate":"Bearer"},
#             )
    
#     user = await UserService.get_user_by_id(token_data.subject)
    
#     if not user:
#         raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail='Invalid token user',
#             )
    
#     return {
#         "access_token": create_access_token(user.id),
#         "refresh_token": create_refresh_token(user.id),
#     }

