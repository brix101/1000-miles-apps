from app.models.user_model import User
from app.models.customer_model import Customer
from typing import List
from app.schemas.customer_schema import CustomerCreate, CustomerUpdate
from typing import Optional
from bson import ObjectId
from app.services.country_service import CountryService
from app.services.currency_service import CurrencyService
from app.services.language_service import LanguageService
from app.services.cust_type_service import CustomerTypeService
from app.services.product_service import ProductService
from app.services.frequency_service import FrequencyService
from app.services.syn_plural_service import SynonymPluralService
from app.services.api_service import APIService
from app.schemas.syn_plural_schema import SynonymPluralCreate
from app.models.product_model import Product
from app.models.language_model import Language
from app.models.api_model import API
from app.models.language_model import Language
from app.models.syn_plural_model import SynonymPlural
from app.core.config import settings
import requests
import nltk
import urllib.parse
import json
from pymongo import UpdateMany, UpdateOne, MongoClient
from bson import json_util
from datetime import datetime


mongo_client = MongoClient(settings.MONGO_CONNECTION_STRING)
db = mongo_client["scraper"]


class CustomerService:
    @staticmethod
    async def list_customers(user: User = None) -> List[Customer]:
        # customers = await Customer.find({"active": True}, fetch_links=True).to_list()
        # return customers
        pipeline = [
            {
                "$lookup": {
                    "from": "sc_custumer_type",
                    "let": {"customerTypeId": "$type.$id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$customerTypeId"]}}}
                    ],
                    "as": "customer_type",
                }
            },
            {
                "$lookup": {
                    "from": "sc_country",
                    "let": {"countryId": "$country.$id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$countryId"]}}}
                    ],
                    "as": "country",
                }
            },
            {
                "$lookup": {
                    "from": "sc_currency",
                    "let": {"currencyId": "$currency.$id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$currencyId"]}}}
                    ],
                    "as": "currency",
                }
            },
            {
                "$lookup": {
                    "from": "sc_language",
                    "let": {"languageId": "$language.$id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$languageId"]}}}
                    ],
                    "as": "language",
                }
            },
            {
                "$lookup": {
                    "from": "sc_frequency",
                    "let": {"frequencyId": "$frequency.$id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$frequencyId"]}}}
                    ],
                    "as": "frequency",
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "name": 1,
                    "type": {"$arrayElemAt": ["$customer_type", 0]},
                    "website": 1,
                    "country": {"$arrayElemAt": ["$country", 0]},
                    "currency": {"$arrayElemAt": ["$currency", 0]},
                    "language": {"$arrayElemAt": ["$language", 0]},
                    "markup": 1,
                    "frequency": {"$arrayElemAt": ["$frequency", 0]},
                    "require_login": 1,
                    "active": 1,
                    "created_at": 1,
                    "updated_at": 1,
                    "spider_name": 1,
                    "image_url": 1,
                    "spider_code": 1,
                    "last_scraped": 1,
                    "scrape_status": 1,
                    "total_products": {"$size": "$products"},
                }
            },
        ]

        customers_list = list(db["sc_customers"].aggregate(pipeline))

        customers = [
            {
                **customer,
                "_id": str(customer["_id"]),
                "type": {
                    **customer["type"],
                    "_id": str(customer["type"]["_id"]),
                }
                if customer.get("type")
                else {},
                "country": {
                    **customer["country"],
                    "_id": str(customer["country"]["_id"]),
                }
                if customer.get("country")
                else {},
                "currency": {
                    **customer["currency"],
                    "_id": str(customer["currency"]["_id"]),
                }
                if customer.get("currency")
                else {},
                "language": {
                    **customer["language"],
                    "_id": str(customer["language"]["_id"]),
                }
                if customer.get("language")
                else {},
                "frequency": {
                    **customer["frequency"],
                    "_id": str(customer["frequency"]["_id"]),
                }
                if customer.get("frequency")
                else {},
            }
            for customer in customers_list
            if customer["active"]
        ]

        return customers

    @staticmethod
    async def create_customer(
        data: CustomerCreate,
        user: User,
    ) -> Customer:
        customer = Customer(**data.dict())
        customer = await customer.insert()
        return await CustomerService.get_customer_by_id(str(customer.id))

    @staticmethod
    async def get_customer_by_id(id: str) -> Optional[Customer]:
        customer = await Customer.find_one(
            Customer.id == ObjectId(id), fetch_links=True
        )
        return customer

    @staticmethod
    async def get_customer_total(id: str) -> Optional[Customer]:
        pipeline = [
            {"$match": {"_id": ObjectId(id)}},
            {"$limit": 1},
            {
                "$lookup": {
                    "from": "sc_custumer_type",
                    "let": {"customerTypeId": "$type.$id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$customerTypeId"]}}}
                    ],
                    "as": "customer_type",
                }
            },
            {
                "$lookup": {
                    "from": "sc_country",
                    "let": {"countryId": "$country.$id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$countryId"]}}}
                    ],
                    "as": "country",
                }
            },
            {
                "$lookup": {
                    "from": "sc_currency",
                    "let": {"currencyId": "$currency.$id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$currencyId"]}}}
                    ],
                    "as": "currency",
                }
            },
            {
                "$lookup": {
                    "from": "sc_language",
                    "let": {"languageId": "$language.$id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$languageId"]}}}
                    ],
                    "as": "language",
                }
            },
            {
                "$lookup": {
                    "from": "sc_frequency",
                    "let": {"frequencyId": "$frequency.$id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$frequencyId"]}}}
                    ],
                    "as": "frequency",
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "name": 1,
                    "type": {"$arrayElemAt": ["$customer_type", 0]},
                    "website": 1,
                    "country": {"$arrayElemAt": ["$country", 0]},
                    "currency": {"$arrayElemAt": ["$currency", 0]},
                    "language": {"$arrayElemAt": ["$language", 0]},
                    "markup": 1,
                    "frequency": {"$arrayElemAt": ["$frequency", 0]},
                    "require_login": 1,
                    "active": 1,
                    "created_at": 1,
                    "updated_at": 1,
                    "spider_name": 1,
                    "image_url": 1,
                    "spider_code": 1,
                    "last_scraped": 1,
                    "scrape_status": 1,
                    "username": 1,
                    "password": 1,
                    "total_products": {"$size": "$products"},
                }
            },
        ]

        result = list(db["sc_customers"].aggregate(pipeline))
        customer_item = result[0]
        customer = {
            **customer_item,
            "_id": str(customer_item["_id"]),
            "type": {
                **customer_item["type"],
                "_id": str(customer_item["type"]["_id"]),
            }
            if customer_item.get("type")
            else {},
            "country": {
                **customer_item["country"],
                "_id": str(customer_item["country"]["_id"]),
            }
            if customer_item.get("country")
            else {},
            "currency": {
                **customer_item["currency"],
                "_id": str(customer_item["currency"]["_id"]),
            }
            if customer_item.get("currency")
            else {},
            "language": {
                **customer_item["language"],
                "_id": str(customer_item["language"]["_id"]),
            }
            if customer_item.get("language")
            else {},
            "frequency": {
                **customer_item["frequency"],
                "_id": str(customer_item["frequency"]["_id"]),
            },
        }

        return customer

    @staticmethod
    async def update_customer(id: str, data: CustomerUpdate, current_user: User):
        customer = await CustomerService.get_customer_total(id)
        temp = data.dict(exclude_unset=True, exclude_none=True)
        products = []
        # if "products" in temp:
        #     product_instances = []
        #     for product in temp["products"]:
        #         product_instances.append(Product(**product))
        #     customer.products.extend(product_instances)
        #     del temp["products"]

        if "country" in temp:
            country = await CountryService.get_country_by_id(temp["country"])
            new_reference = {"$ref": "sc_country", "$id": country.id}
            temp["country"] = new_reference

        if "currency" in temp:
            currency = await CurrencyService.get_currency_by_id(temp["currency"])
            new_reference = {"$ref": "sc_currency", "$id": currency.id}
            temp["currency"] = new_reference

        if "language" in temp:
            language = await LanguageService.get_language_by_id(temp["language"])
            new_reference = {"$ref": "sc_language", "$id": language.id}
            temp["language"] = new_reference

        if "type" in temp:
            type_ = await CustomerTypeService.get_customer_type_by_id(temp["type"])
            new_reference = {"$ref": "sc_customer_type", "$id": type_.id}
            temp["type"] = new_reference

        if "frequency" in temp:
            frequency = await FrequencyService.get_frequency_type_by_id(
                temp["frequency"]
            )
            new_reference = {"$ref": "sc_frequency", "$id": frequency.id}
            temp["frequency"] = new_reference

        if temp["name"] != customer["name"] or temp["markup"] != customer["markup"]:
            products = await ProductService.get_customer_products(id)

        if "name" in temp and temp["name"] != customer["name"]:
            algolia = APIService.update_product_in_algolia(
                customer, temp["name"], products
            )

        if "markup" in temp and temp["markup"] != customer["markup"]:
            products_res = await ProductService.update_product_markup(
                customer, temp["markup"], products
            )

        # await customer.update({"$set": temp})
        # await customer.save()

        db.sc_customers.update_one({"_id": ObjectId(id)}, {"$set": temp})
        customer = await CustomerService.get_customer_total(id)
        return customer

    @staticmethod
    async def delete_customer(id: str, current_user: User):
        customer = await CustomerService.get_customer_by_id(id)
        await customer.update({"$set": {"active": False}})
        await customer.save()
        return None

    # SCRAPE
    @staticmethod
    async def scrape_now(id: str, current_user: User = None) -> Customer:
        customer = await CustomerService.get_customer_total(id)
        db.sc_customers.update_one({"_id": ObjectId(id)}, {"$set": {"last_scraped": datetime.utcnow(), "scrape_status": "running"}})
        try:

            if customer['require_login']:
                args = {"username": customer['username'], "password": customer['password']}
                json_args = json.dumps(args)
                args = urllib.parse.quote(json_args)
                response = requests.get(
                    f"{settings.SCRAPER_API}/crawl.json?spider_name={customer['spider_name']}&start_requests=True&crawl_args={args}"
                )
            else:
                response = requests.get(
                    f"{settings.SCRAPER_API}/crawl.json?spider_name={customer['spider_name']}&start_requests=True"
                )
            data = response.json()
            new_product_ids = []
            algolia_products = []
            count = 0
            total_items = len(data["items"]) if 'items' in data else 0
            currency_value = customer['currency']['value']

            if total_items > 0:
                # SYNONYMS AND PLURAL AND TAGS
                language = await Language.find_one(Language.default == True)
                nltk.download("wordnet")
                nltk.download("punkt")
                nltk.download("averaged_perceptron_tagger")

                # TRANSLATION
                trnslt_api = await API.find_one(API.translation == True)
                trnslt_to = [language.code]
                fr = customer['language']['code']

                for index, prod in enumerate(data["items"]):
                    # TRANSLATION
                    if customer['language']['code'] != "en":
                        body = [{"text": prod["name"]}, {"text": prod["description"]}]
                        for category in prod["categories"]:
                            body.append({"text": category["name"]})
                        words = await APIService.translate(
                            body, trnslt_api.key, trnslt_to, fr
                        )
                        prod["name"] = words[0]["translations"][0]["text"]
                        prod["description"] = words[1]["translations"][0]["text"]
                        categs = []
                        for i in range(2, len(words)):
                            categs.append(
                                {
                                    "name": words[i]["translations"][0]["text"],
                                    "level": i - 2,
                                }
                            )
                        prod["categories"] = categs

                    prod_exist = await Product.find_one(
                        Product.name == prod["name"],
                        Product.categories == prod["categories"],
                    )

                    if prod_exist is None:
                        hierarchicalCategories = {}
                        # SYNONYMS AND PLURAL
                        for ct in prod["categories"]:
                            hierarchicalCategories[f"lvl{ct['level']}"] = ct['name'].lower()
                            existing = await SynonymPlural.find_one(
                                SynonymPlural.word == ct["name"].lower()
                            )
                            if existing is None:
                                try:
                                    synonyms = APIService.synonyms(ct["name"].lower())
                                    plurals = APIService.plurals(ct["name"].lower())
                                    sp_schema = SynonymPlural(
                                        **{
                                            "word": ct["name"].lower(),
                                            "language": str(language.id),
                                            "synonyms": synonyms,
                                            "plural": plurals,
                                        }
                                    )

                                    await sp_schema.insert()
                                except Exception as e:
                                    continue

                        # TAGS
                        tags = APIService.tags(prod["name"])
                        if "description" in prod:
                            desc_tags = APIService.tags(prod["description"])
                            tags = tags + desc_tags

                        prod["tags"] = tags
                        prod['price_usd'] = prod['price'] / currency_value if prod['price'] is not None else 0

                        # MARKUP
                        if customer['markup'] is not None and customer['markup'] != 0:
                            estimated = prod["price"] / customer['markup'] 
                            prod["markup"] = customer['markup']
                            prod["estimated_markup"] = estimated

                        new_product = await Product.insert_one(Product(**prod))
                        new_product_ids.append(new_product.id)

                        sc_data = {
                                '$ref': 'sc_products',
                                '$id': new_product.id
                            }
                        db.sc_customers.update_one({"_id": ObjectId(id)}, { "$push": { "products": sc_data }})

                        # TO ALGOLIA:
                        # PRODUCT
                        agl_prod = new_product.dict()
                        agl_prod["objectID"] = str(new_product.id)
                        agl_prod["id"] = str(agl_prod["id"])
                        agl_prod['timestamp'] = datetime.timestamp(agl_prod['created_at'])
                        agl_prod["created_at"] = str(agl_prod["created_at"])
                        agl_prod["updated_at"] = str(agl_prod["updated_at"])
                        agl_prod['hierarchicalCategories'] = hierarchicalCategories
                        agl_data = {
                            **agl_prod,
                            "customer_name": customer['name'],
                            "customer_id": str(customer['_id']),
                        }
                        APIService.save_product_to_algolia(agl_data)
                        # count += 1
                        # if count >= 5000:
                        #     APIService.save_products_bulk_algolia(algolia_products)
                        #     count = 0
                        #     algolia_products = []
                        # else:
                        #     algolia_products.append(agl_data)


                # if len(algolia_products) > 0:
                #     APIService.save_products_bulk_algolia(algolia_products)

                # new_products = await Product.find(
                #     {"_id": {"$in": new_product_ids}}
                # ).to_list()

                db.sc_customers.update_one({"_id": ObjectId(id)}, {"$set": {"last_scraped": datetime.utcnow(), "scrape_status": "success"}})

            else:
                db.sc_customers.update_one({"_id": ObjectId(id)}, {"$set": {"last_scraped": datetime.utcnow(), "scrape_status": "error"}})

            return customer
        
        except Exception as e:
            print(e)
            db.sc_customers.update_one({"_id": ObjectId(id)}, {"$set": {"last_scraped": datetime.utcnow(), "scrape_status": "success"}})
            return customer



    # UPLOAD MANUALLY
    @staticmethod
    async def scrape_depot_now() -> Customer:
        id_ = '64c23519a97cd66f706c71df'
        customer = await CustomerService.get_customer_total(id_)
        db.sc_customers.update_one({"_id": ObjectId(id_)}, {"$set": {"last_scraped": datetime.utcnow(), "scrape_status": "running"}})
        file_path = 'app/services/ganzResult_unique.json'
        new_product_ids = []
        with open(file_path, encoding='utf-8') as json_file:
            data = json.load(json_file)
        print(len(data))
        print('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
        new_product_ids = []
        algolia_products = []
        count = 0
        total_items = len(data)
        currency_value = customer['currency']['value']

        if total_items > 0:
            # SYNONYMS AND PLURAL AND TAGS
            language = await Language.find_one(Language.default == True)
            nltk.download("wordnet")
            nltk.download("punkt")
            nltk.download("averaged_perceptron_tagger")

            # TRANSLATION
            trnslt_api = await API.find_one(API.translation == True)
            trnslt_to = [language.code]
            fr = customer['language']['code']

            for index, prod in enumerate(data):

                hierarchicalCategories = {}
                # SYNONYMS AND PLURAL
                for ct in prod["categories"]:
                    hierarchicalCategories[f"lvl{ct['level']}"] = ct['name'].lower()
                    existing = await SynonymPlural.find_one(
                        SynonymPlural.word == ct["name"].lower()
                    )
                    if existing is None:
                        try:
                            synonyms = APIService.synonyms(ct["name"].lower())
                            plurals = APIService.plurals(ct["name"].lower())
                            sp_schema = SynonymPlural(
                                **{
                                    "word": ct["name"].lower(),
                                    "language": str(language.id),
                                    "synonyms": synonyms,
                                    "plural": plurals,
                                }
                            )

                            await sp_schema.insert()
                        except Exception as e:
                            continue

                # TAGS
                tags = APIService.tags(prod["name"])
                if "description" in prod:
                    desc_tags = APIService.tags(prod["description"])
                    tags = tags + desc_tags

                prod["tags"] = tags
                prod['price_usd'] = prod['price'] / currency_value if prod['price'] is not None else 0

                # MARKUP
                if customer['markup'] is not None and customer['markup'] != 0:
                    estimated = prod["price"] / customer['markup'] 
                    prod["markup"] = customer['markup']
                    prod["estimated_markup"] = estimated

                new_product = await Product.insert_one(Product(**prod))
                new_product_ids.append(new_product.id)

                sc_data = {
                        '$ref': 'sc_products',
                        '$id': new_product.id
                    }
                db.sc_customers.update_one({"_id": ObjectId(id_)}, { "$push": { "products": sc_data }})
            

                # TO ALGOLIA:
                # PRODUCT
                agl_prod = new_product.dict()
                agl_prod["objectID"] = str(new_product.id)
                agl_prod["id"] = str(agl_prod["id"])
                agl_prod['timestamp'] = datetime.timestamp(agl_prod['created_at'])
                agl_prod["created_at"] = str(agl_prod["created_at"])
                agl_prod["updated_at"] = str(agl_prod["updated_at"])
                agl_prod['hierarchicalCategories'] = hierarchicalCategories
                agl_data = {
                    **agl_prod,
                    "customer_name": customer['name'],
                    "customer_id": str(customer['_id']),
                }
                APIService.save_product_to_algolia(agl_data)

            db.sc_customers.update_one({"_id": ObjectId(id_)}, {"$set": {"last_scraped": datetime.utcnow(), "scrape_status": "success"}})

        else:
            db.sc_customers.update_one({"_id": ObjectId(id_)}, {"$set": {"last_scraped": datetime.utcnow(), "scrape_status": "success"}})

        return customer