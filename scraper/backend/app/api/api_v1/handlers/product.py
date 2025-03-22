from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.models.product_model import Product
from app.schemas.product_schema import ProductCreate, ProductUpdate
from app.services.product_service import ProductService
from app.services.category_service import CategoryService
from app.services.product_service import ProductService
from app.services.customer_service import CustomerService
from app.services.api_service import APIService
from bson import ObjectId
from time import sleep

product_router = APIRouter()

special_characters = [':', '/', '?', '#', '[', ']', '@', '!', '$', '&','\'', '(', ')', '*', '+', ';', '=', '\n']

@product_router.get("/", summary="Get all products")
async def products(current_user: User = Depends(get_current_user)):
    products = await ProductService.list_products(current_user)
    return products


@product_router.post("/", summary="Create product")
async def create_product(
    data: ProductCreate, current_user: User = Depends(get_current_user)
):
    product = await ProductService.create_product(data, current_user)
    return product.dict()


@product_router.put("/{id}", summary="Update product")
async def update_product(
    id: str, data: ProductUpdate, current_user: User = Depends(get_current_user)
):
    try:
        product = await ProductService.update_product(id, data, current_user)
        return product.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update",
        )


@product_router.delete("/{id}", summary="Delete product")
async def delete_product(id: str, current_user: User = Depends(get_current_user)):
    await ProductService.delete_product(id, current_user)
    return {"status": "success"}


@product_router.get("/tags-score", summary="Get all tags score")
async def product_tags_score(current_user: User = Depends(get_current_user)):
    products = await ProductService.product_tags_score(current_user)
    return products


@product_router.get("/categories-score", summary="Get all categories score")
async def product_categories_score(current_user: User = Depends(get_current_user)):
    products = await ProductService.product_categories_score(current_user)
    return products


@product_router.put("/product-categorization/{customer_id}", summary="Uniformly Categorize Product")
async def product_categorization(customer_id: str, current_user: User = Depends(get_current_user)):
    try:
        customer_products = await ProductService.get_customer_products(customer_id)
        c = 0
        for prod in customer_products:
            product = prod['product_data'][0]
            id_ = str(product['_id'])
            if 'category' not in product or product['category'] is None:
                word = product['name']
                if product['description'] is not None:
                    if '.' in product['description']:
                        des_ = product['description'].split('.')
                        word = word + '. ' + des_[0]
                    else:
                        word = word + '. ' + product['description']
                for sc in special_characters:
                    word = word.replace(sc, ' ')
                word = word.lower()
                categorization = await CategoryService.categorize_product(word, id_)
                # sleep(1)
            else:
                c+=1
                print(c)
        return {'status': 'success'}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update",
        )
    


@product_router.put("/product-categorization-algolia/{customer_id}", summary="Update Uniformly Categorize Product in Algolia")
async def product_categorization_algolia(customer_id: str, current_user: User = Depends(get_current_user)):
    customer_products = await ProductService.get_customer_products(customer_id)
    APIService.update_product_categorization_in_algolia(customer_products)


@product_router.put("/products-to_algolia/{customer_id}", summary="Re adding products to Algolia")
async def product_categorization_algolia(customer_id: str, current_user: User = Depends(get_current_user)):
    customer = await CustomerService.get_customer_total(customer_id)
    customer_products = await ProductService.get_customer_products(customer_id)
    APIService.add_product_cat_in_algolia(customer_products, customer)
   