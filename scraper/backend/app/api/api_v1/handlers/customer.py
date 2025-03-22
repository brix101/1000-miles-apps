from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.models.customer_model import Customer
from app.schemas.customer_schema import (
    CustomerCreate,
    CustomerUpdate,
    CustomerProducts,
)
from app.services.customer_service import CustomerService
from app.helpers.save_picture import save_picture
from app.helpers.save_file import save_file
from pyfa_converter import FormDepends
from app.models.product_model import Product


customer_router = APIRouter()


@customer_router.get("/", summary="Get all customers")
async def customers(current_user: User = Depends(get_current_user)):
    customers = await CustomerService.list_customers(current_user)
    return customers


@customer_router.get("/{id}", summary="Get Customer")
async def get_customer(id: str, current_user: User = Depends(get_current_user)):
    customer = await CustomerService.get_customer_total(id)
    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )
    return customer


@customer_router.post("/", summary="Create customer")
async def create_customer(
    data: CustomerCreate = FormDepends(CustomerCreate),
    file: UploadFile = File(None),
    code: UploadFile = File(None),
    current_user: User = Depends(get_current_user),
):
    if file is not None:
        imageUrl = save_picture(file=file, folderName="customers")
        data.image_url = imageUrl

    customer = await CustomerService.create_customer(data, current_user)

    if code is not None and customer is not None:
        save_file(
            file=code, folderName="codes", fileName=str(customer.dict().get("id"))
        )

    return customer.dict()


@customer_router.put("/{id}", summary="Update customer")
async def update_customer(
    id: str,
    data: CustomerUpdate = FormDepends(CustomerUpdate),
    file: UploadFile = File(None),
    code: UploadFile = File(None),
    current_user: User = Depends(get_current_user),
):
    try:
        if file is not None:
            imageUrl = save_picture(file=file, folderName="customers")
            data.image_url = imageUrl

        customer = await CustomerService.update_customer(id, data, current_user)
        if code is not None and customer is not None:
            save_file(
                file=code, folderName="codes", fileName=str(customer.get("_id", id))
            )

        return customer
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update",
        )


@customer_router.post("/{id}/products", summary="Add customer products")
async def add_customer_products(
    id: str,
    data: CustomerProducts,
    current_user: User = Depends(get_current_user),
):
    try:
        customer = await CustomerService.update_customer(id, data, current_user)
        return customer
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update",
        )


@customer_router.delete("/{id}", summary="Delete customer")
async def delete_customer(id: str, current_user: User = Depends(get_current_user)):
    await CustomerService.delete_customer(id, current_user)
    return {"status": "success"}


@customer_router.get("/{id}/scrape/", summary="Scrape customer")
async def get_user(id: str, current_user: User = Depends(get_current_user)):
    customer = await CustomerService.scrape_now(id, current_user)
    return customer.dict()


# NEVERMIND THIS I JUST THIS FOR DEBUGGING
@customer_router.get("/fixed/", summary="Scrape customer")
async def get_user():
    customer = await CustomerService.scrape_depot_now()

    return {"status": "success"}
