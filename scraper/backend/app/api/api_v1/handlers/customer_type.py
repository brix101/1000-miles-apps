from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.models.cust_type_model import CustomerType
from app.schemas.cust_type_schema import CustomerTypeCreate, CustomerTypeUpdate
from app.services.cust_type_service import CustomerTypeService

cust_type_router = APIRouter()

@cust_type_router.get('/', summary='Get all customer type')
async def customer_type(current_user: User = Depends(get_current_user)):
    types = await CustomerTypeService.list_customer_type(current_user)
    return types

@cust_type_router.post('/', summary='Create customer type')
async def create_customer_type(data: CustomerTypeCreate, current_user: User = Depends(get_current_user)):
    typ = await CustomerTypeService.create_customer_type(data, current_user)
    return typ.dict()

@cust_type_router.put('/{id}', summary='Update customer type')
async def update_customer_type(id: str, data: CustomerTypeUpdate, current_user: User = Depends(get_current_user)):
    try:
        typ = await CustomerTypeService.update_customer_type(id, data, current_user)
        return typ.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update"
        )

@cust_type_router.delete('/{id}', summary="Delete customer type")
async def delete_customer_type(id: str, current_user: User = Depends(get_current_user)):
    await CustomerTypeService.delete_customer_type(id, current_user)
    return {"status": "success"}