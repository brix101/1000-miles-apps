from app.models.user_model import User
from app.models.product_model import Product
from app.models.customer_model import Customer
from app.services.api_service import APIService
from typing import List
from app.schemas.product_schema import ProductCreate, ProductUpdate
from typing import Optional
from bson import ObjectId
from pymongo import UpdateMany, UpdateOne, MongoClient
from app.core.config import settings
import math

mongo_client = MongoClient(settings.MONGO_CONNECTION_STRING)
db = mongo_client["scraper"]


class ProductService:
    @staticmethod
    async def list_products(user: User) -> List[Product]:
        products = await Product.find({"active": True}).to_list()
        return products

    @staticmethod
    async def create_product(
        data: ProductCreate,
        user: User,
    ) -> Product:
        product = Product(**data.dict())
        return await product.insert()

    @staticmethod
    async def get_product_by_id(id: str) -> Optional[Product]:
        product = await Product.find_one(Product.id == ObjectId(id))
        return product

    @staticmethod
    async def update_product(id: str, data: ProductUpdate, current_user: User):
        product = await ProductService.get_product_by_id(id)
        await product.update({"$set": data.dict(exclude_unset=True)})
        await product.save()
        return product

    @staticmethod
    async def delete_role(id: str, current_user: User):
        product = await ProductService.get_product_by_id(id)
        await product.update({"$set": {"active": False}})
        await product.save()
        return None

    @staticmethod
    async def update_product_markup(customer: Customer, value: float, products):
        data = []
        markup = value
        bulk_updates = []
        for prod in products:
            product = prod['product_data'][0]
            if product['price']is not None:
                estimated = product['price'] / markup
                data.append(
                    {
                        "objectID": str(product['_id']),
                        "markup": markup,
                        "estimated_markup": estimated,
                    }
                )
                update_query = {
                    "$set": {"markup": markup, "estimated_markup": estimated}
                }
                bulk_update_op = UpdateOne({"_id": product['_id']}, update_query)
                bulk_updates.append(bulk_update_op)
        if len(data) > 0:
            collection = db["sc_products"]
            collection.bulk_write(bulk_updates)
            APIService.update_product_markup_in_algolia(data)

        return None

    @staticmethod
    async def product_tags_score(
        user: User,
    ) -> Product:
        collection = db["sc_products"]
        pipeline = [
            {"$unwind": "$tags"},  # Unwind the tags array
            {
                "$group": {
                    "_id": "$tags",
                    "lowest": {"$min": "$price_usd"},  # Find the minimum price
                    "highest": {"$max": "$price_usd"},  # Find the maximum price
                    "markup_percent": {"$avg": "$markup"},  # Find the average markup
                }
            },
            {
                "$project": {
                    "_id": {
                        "$replaceOne": {"input": "$_id", "find": "'", "replacement": ""}
                    },  # Remove single quotes from _id
                    "lowest": {
                        "$ifNull": ["$lowest", 0]
                    },  # Replace NaN with 0 for lowest
                    "highest": {
                        "$ifNull": ["$highest", 0]
                    },  # Replace NaN with 0 for highest
                    "markup_percent": {
                        "$ifNull": ["$markup_percent", 0]
                    },  # Replace NaN with 0 for markup_percent
                }
            },
        ]
        # Execute the aggregation pipeline
        result = list(collection.aggregate(pipeline))
        # Catch NaN values and handle them
        for doc in result:
            # Check and replace 'lowest' field with 0 if it's NaN
            if "lowest" in doc and math.isnan(doc["lowest"]):
                doc["lowest"] = 0

            # Check and replace 'highest' field with 0 if it's NaN
            if "highest" in doc and math.isnan(doc["highest"]):
                doc["highest"] = 0

            # Check and replace 'markup_percent' field with 0 if it's NaN
            if "markup_percent" in doc and math.isnan(doc["markup_percent"]):
                doc["markup_percent"] = 0

        return result

    @staticmethod
    async def product_categories_score(
        user: User,
    ) -> Product:
        collection = db["sc_products"]
        pipeline = [
            {"$unwind": "$categories"},  # Unwind the categories array
            {
                "$group": {
                    "_id": "$categories.name",
                    "lowest": {"$min": "$price_usd"},  # Find the minimum price
                    "highest": {"$max": "$price_usd"},  # Find the maximum price
                    "markup_percent": {"$avg": "$markup"},
                }
            },
            {
                "$project": {
                    "_id": {
                        "$replaceOne": {"input": "$_id", "find": "'", "replacement": ""}
                    },  # Remove single quotes from _id
                    "lowest": {
                        "$ifNull": ["$lowest", 0]
                    },  # Replace NaN with 0 for lowest
                    "highest": {
                        "$ifNull": ["$highest", 0]
                    },  # Replace NaN with 0 for highest
                    "markup_percent": {
                        "$ifNull": ["$markup_percent", 0]
                    },  # Replace NaN with 0 for markup_percent
                }
            },
        ]
        # Execute the aggregation pipeline
        result = list(collection.aggregate(pipeline))
        # Catch NaN values and handle them
        for doc in result:
            # Check and replace 'lowest' field with 0 if it's NaN
            if "lowest" in doc and math.isnan(doc["lowest"]):
                doc["lowest"] = 0

            # Check and replace 'highest' field with 0 if it's NaN
            if "highest" in doc and math.isnan(doc["highest"]):
                doc["highest"] = 0

            # Check and replace 'markup_percent' field with 0 if it's NaN
            if "markup_percent" in doc and math.isnan(doc["markup_percent"]):
                doc["markup_percent"] = 0
        return result

    @staticmethod
    async def get_customer_products(id: str):
        pipeline = [
            {"$match": {"_id": ObjectId(id)}},
            {
                "$unwind": "$products"
            },
            {
                "$lookup": {
                    "from": "sc_products",
                    "localField": "products.$id",
                    "foreignField": "_id",
                    "as": "product_data"
                }
            }
        ]

        orders_with_products = list(db.sc_customers.aggregate(pipeline))

        return orders_with_products

