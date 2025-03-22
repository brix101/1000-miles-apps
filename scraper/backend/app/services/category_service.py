from app.models.category_model import Category
from app.services.api_service import APIService
from typing import List
from app.schemas.category_schema import (
    CategoryCreate,
    CategoryUpdate,
    CategoryRemoveSub,
    CategorySearchRequest,
    PaginatedCategoryResponse,
)
from typing import Optional
from bson import ObjectId
from app.core.config import settings
from pymongo import MongoClient
from beanie.odm.fields import Link
import json


mongo_client = MongoClient(settings.MONGO_CONNECTION_STRING)
db = mongo_client["scraper"]
categories_collection = db["sc_categories"]


# Define an asynchronous version of the populate_sub function
async def populate_sub(category):
    sub = category.sub
    populated_sub = []
    for sub_link in sub:
        if isinstance(sub_link, Link):
            sub = await sub_link.fetch(fetch_links=True)
            if sub:
                populated_sub.append(sub)
                # Recursively populate sub's sub
                await populate_sub(sub)
        else:
            populated_sub.append(sub_link)
            # Recursively populate sub's sub
            await populate_sub(sub_link)

    category.sub = populated_sub


class CategoryService:
    @staticmethod
    async def list_categories() -> List[Category]:
        categories = (
            await Category.find({"active": True, "level": 0}, fetch_links=True)
            .sort("+category")
            .to_list()
        )

        for category_data in categories:
            await populate_sub(category_data)

        return categories

    @staticmethod
    async def list_categories_unpopulated(
        request: CategorySearchRequest,
    ) -> List[Category]:
        query = {"active": True}
        if request.category:
            query["category"] = {"$regex": request.category, "$options": "i"}

        total_count = categories_collection.count_documents(query)
        total_pages = (total_count + request.per_page - 1) // request.per_page

        categories = (
            await Category.find(query)
            .skip((request.page - 1) * request.per_page)
            .limit(request.per_page)
            .sort("+category")
            .to_list()
        )
        response = PaginatedCategoryResponse(
            total=total_count,
            page=request.page,
            per_page=request.per_page,
            total_pages=total_pages,
            items_count=len(categories),
            categories=categories,
        )
        return response

    @staticmethod
    async def create_category(data: CategoryCreate) -> Category:
        existing_category = await Category.find_one(Category.category == data.category)
        if existing_category:
            await existing_category.update({"$set": {"active": True}})
            await existing_category.save()
            return existing_category
        else:
            category = Category(**data.dict(), active=True)
            return await category.insert()

    @staticmethod
    async def get_category_by_id(id: str) -> Optional[Category]:
        category = await Category.find_one(
            Category.id == ObjectId(id), fetch_links=True
        )
        return category

    @staticmethod
    async def add_sub_category(id: str, data: CategoryUpdate):
        parend_category = await CategoryService.get_category_by_id(id)
        new_sub = await CategoryService.create_category(data)

        if new_sub not in parend_category.sub:
            await new_sub.update({"$set": {"level": parend_category.level + 1}})
            await new_sub.save()

            parend_category.sub.append(new_sub)
            await parend_category.save()

        await populate_sub(parend_category)
        return parend_category

    @staticmethod
    async def remove_sub_category(id: str, data: CategoryRemoveSub):
        category = await CategoryService.get_category_by_id(id)
        sub_ids = data.sub_ids

        category.sub = list(
            filter(
                lambda sub: str(sub.dict().get("id", "")) not in sub_ids,
                category.sub,
            )
        )

        await category.save()
        return category

    @staticmethod
    async def update_category(id: str, data: CategoryUpdate):
        category = await CategoryService.get_category_by_id(id)
        await category.update({"$set": data.dict(exclude_unset=True)})
        await category.save()
        await populate_sub(category)
        return category

    @staticmethod
    async def delete_category(id: str):
        category = await CategoryService.get_category_by_id(id)
        await category.update({"$set": {"active": False}})
        await category.save()
        return None

    @staticmethod
    async def add_category_file():
        file_path = "app/services/product_categories.json"
        with open(file_path, encoding="utf-8") as json_file:
            item = json.load(json_file)

        for line in item:
            parent_id = []
            for key, value in line.items():
                number = int("".join(filter(str.isdigit, key)))
                value = value.strip()
                existing_category = await Category.find_one(Category.category == value)
                if not existing_category:
                    if number != 0:
                        result = ">".join(line.values())
                        classification = result.strip()
                    else:
                        classification = value

                    category = Category(
                        category=value,
                        level=number,
                        classification=classification,
                        active=True,
                    )
                    new_category = await category.insert()

                    if len(parent_id) > 0:
                        parend_category = await CategoryService.get_category_by_id(
                            parent_id[-1]
                        )
                        if new_category not in parend_category.sub:
                            parend_category.sub.append(new_category)
                            await parend_category.save()

                    parent_id.append(new_category.id)
                    print(
                        "+++++++++++++",
                        new_category.level,
                        new_category.id,
                        new_category.category,
                    )
                else:
                    parent_id.append(existing_category.id)

    @staticmethod
    async def categorize_product(word: str, id: str):
        try:
            data = await APIService.product_categorization(word)
            classification = data["classification"]
            category = await Category.find_one(
                Category.classification == classification
            )
            sc_data = {"$ref": "sc_categories", "$id": category.id}
            db.sc_products.update_one(
                {"_id": ObjectId(id)}, {"$set": {"category": sc_data}}
            )
            return category
        except Exception as e:
            print(e)
            return None
