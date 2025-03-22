from app.models.user_model import User
from app.models.api_model import API
from app.models.customer_model import Customer
from app.models.currency_model import Currency
from typing import List
from app.schemas.api_schema import APICreate, APIUpdate
from typing import Optional
from bson import ObjectId
import requests, uuid, json
from algoliasearch.search_client import SearchClient
from nltk.corpus import wordnet
import inflect
import nltk
import requests
from datetime import datetime
from bson.dbref import DBRef
from pymongo import UpdateMany, UpdateOne, MongoClient
from app.core.config import settings
import urllib.parse

mongo_client = MongoClient(settings.MONGO_CONNECTION_STRING)
db = mongo_client["scraper"]

# TRANSLATION
TRNSLT_endpoint = "https://api.cognitive.microsofttranslator.com/"
TRNSLT_location = "southeastasia"
TRNSLT_path = '/translate'
TRNSLT_constructed_url = TRNSLT_endpoint + TRNSLT_path

# ALGOLIA
ALGLA_client = SearchClient.create("8885YNMZAP", "b70bc54e54d6563daebbfc9e65316f8c")


# CURRENCY
currency_api = "ae8ca8d23628021f6ab661db"

# PRODUCT CATEGORIZATION
PRDCTZ_api = "HlvskBxbXJYjNrp"


class APIService:
    @staticmethod
    async def list_api(user: User) -> List[API]:
        apis = await API.find({"active":True}).to_list()
        return apis
    
    @staticmethod
    async def create_api(data: APICreate, user: User,) -> API:
        api = API(**data.dict())
        return await api.insert()
    
    @staticmethod
    async def get_api_by_id(id: str) -> Optional[API]:
        api =await API.find_one(API.id == ObjectId(id))
        return api
    
    @staticmethod
    async def update_api(id: str, data: APIUpdate, current_user: User):
        api = await APIService.get_api_by_id(id)
        await api.update({"$set": data.dict(exclude_unset=True)})
        await api.save()
        return api
    
    @staticmethod
    async def delete_api(id: str, current_user: User):
        api = await APIService.get_api_by_id(id)
        await api.update({"$set": {"active": False}})
        await api.save()
        return None


    # TRANSLATION 
    @staticmethod
    async def translate(data: list, key: str, to: list, fr: str):
        params = {
            'api-version': '3.0',
            'from': fr,
            'to': to
        }
        headers = {
            'Ocp-Apim-Subscription-Key': key,
            # location required if you're using a multi-service or regional (not global) resource.
            'Ocp-Apim-Subscription-Region': TRNSLT_location,
            'Content-type': 'application/json',
            'X-ClientTraceId': str(uuid.uuid4())
        }

        request = requests.post(TRNSLT_constructed_url, params=params, headers=headers, json=data)
        response = request.json()

        return response
    
    # SYNONYMS 
    @staticmethod
    def synonyms(word: str):
        try:
            synonyms = []
            for syn in wordnet.synsets(word):
                for i in syn.lemmas():
                    synonyms.append(i.name())
            
            temp = set(synonyms)
            synonyms = list(temp)
            return synonyms
        except Exception as e:
            return []
    
    # PLURAL 
    @staticmethod
    def plurals(word: str):
        try:
            p = inflect.engine()
            plural = p.plural(word)
            return [plural]
        except Exception as e:
            return []
    
    # TAGS 
    @staticmethod
    def tags(word: str):
        try:
            tokens = nltk.word_tokenize(word)
            pos_tags = nltk.pos_tag(tokens)
            tags = [word for word, tag in pos_tags if tag.startswith('NN') or tag.startswith('JJ')]
            tags = set(tags)
            tags = list(tags)
            fin_tags = tags
            if len(fin_tags)>0:
                fin_tags = [item.lower() for item in tags if len(item) > 1]
            return fin_tags
        except Exception as e:
            return []
        
    
    # ALGOLIA
    @staticmethod
    def save_product_to_algolia(product: dict):
        index = ALGLA_client.init_index("sc_products")
        index.save_object(product).wait()
        return {'status': 'success'}
    
    @staticmethod
    def save_products_bulk_algolia(products: list):
        index = ALGLA_client.init_index("sc_products")
        index.save_objects(products)
        return {'status': 'success'}
    
    @staticmethod
    def delete_product_in_algolia(objectID: str):
        index = ALGLA_client.init_index("sc_products")
        index.delete_object(objectID) 
        return {'status': 'success'}

    @staticmethod
    def update_product_in_algolia(customer: Customer, name: str, products):
        index = ALGLA_client.init_index("sc_products")
        update_data = []
        for prod in products:
            product = prod['product_data'][0]
            update_data.append({
                'objectID': str(product['_id']),
                'customer_name': name
            })
        index.partial_update_objects(update_data)
        return {'status': 'success'}
    
    @staticmethod
    def update_product_markup_in_algolia(data: dict):
        index = ALGLA_client.init_index("sc_products")
        index.partial_update_objects(data)
        return {'status': 'success'}
    

    # CURRENCY
    @staticmethod
    async def update_currency_value():
        try:
            default_curr = await Currency.find_one(Currency.default == True)
            url = f"https://v6.exchangerate-api.com/v6/{currency_api}/latest/{default_curr.code}"
            response = requests.get(url)
            data = response.json()
            rates = data['conversion_rates']
            all_curr = await Currency.find().to_list()
            for curr in all_curr:
                if curr.code in rates:
                    await curr.update({"$set": {"value": rates[curr.code], "updated_at": datetime.utcnow()}})
                    await curr.save()

            return {'status': 'success'}
        except Exception as e:
            print(e)
            return {'status': 'error'}
        
    
    # PRODUCT CATEGORIZATION
    @staticmethod
    async def product_categorization(word: str):
        try:
            word = urllib.parse.quote(word)
            request_url = f"https://www.productcategorization.com/api/ecommerce/ecommerce_category6_get.php?query={word}&api_key={PRDCTZ_api}"
            response = requests.get(request_url)
            data = response.json()
            print(data)
            return data

        except Exception as e:
            print(e)
            return None

    # PRODUCT CATEGORIZATION EDIT IN ALGOLIA
    @staticmethod
    def update_product_categorization_in_algolia(products):
        update_data = []
        for prod in products:
            product = prod['product_data'][0]    
            if 'category' in product and isinstance(product['category'], DBRef):
                # Dereference the DBRef to get the referenced document
                referenced_document = db.dereference(product['category'])
                scraper_categories = []
                hierarchicalScraperCategories = {}
                sc = referenced_document['classification'].split(' >')
                for index, ct in enumerate(sc):
                    scraper_categories.append({
                        'name': ct,
                        'level': index
                    })
                    hierarchicalScraperCategories[f"lvl{index}"] = ct

                update_data.append({
                    'objectID': str(product['_id']),
                    'scraper_categories': scraper_categories,
                    'hierarchicalScraperCategories': hierarchicalScraperCategories
                })
            else:
                update_data.append({
                    'objectID': str(product['_id']),
                    'scraper_categories': [],
                    'hierarchicalScraperCategories': {}
                })

        index = ALGLA_client.init_index("sc_products")
        index.partial_update_objects(update_data)
        return {'status': 'success'}
    
    
    # JUST READDING PRODUCTS IN ALGOLIA
    @staticmethod
    def add_product_cat_in_algolia(products, customer):
        update_data = []
        currency_value = customer['currency']['value']
        for index , prod in enumerate(products):
            product = prod['product_data'][0]
            agl_prod = {}
            agl_prod["objectID"] = str(product['_id'])
            agl_prod["id"] = str(product['_id'])
            agl_prod['name'] = product['name']
            agl_prod['image'] = product['image']
            agl_prod['price'] = product['price']
            agl_prod['price_usd'] = product['price'] / currency_value if product['price'] is not None else 0
            agl_prod['description'] = product['description']
            if product['description'] is not None and '.' in product['description']:
                descriptions = product['description'].split('.')
                agl_prod['description'] = descriptions[0]
            agl_prod['categories'] = product['categories']
            agl_prod['tags'] = []
            for tag in product['tags']:
                if len(tag) > 3:
                    agl_prod['tags']
            agl_prod['markup'] = product['markup']
            agl_prod['estimated_markup'] = product['estimated_markup']
            agl_prod['review_score'] = product['review_score']
            agl_prod['review_number'] = product['review_number']
            agl_prod['customer_id'] = str(customer['_id'])
            agl_prod['customer_name'] = customer['name']
            agl_prod['timestamp'] = datetime.timestamp(product['created_at'])
            agl_prod["created_at"] = str(product["created_at"])
            agl_prod["updated_at"] = str(product["updated_at"])

            hierarchicalCategories = {}
            for ct in product['categories']:
                hierarchicalCategories[f"lvl{ct['level']}"] = ct['name'].lower()

            agl_prod["hierarchicalCategories"] = hierarchicalCategories
            agl_prod["scraper_categories"] = []
            agl_prod["hierarchicalScraperCategories"] = {}

            if 'category' in product and isinstance(product['category'], DBRef):
                # Dereference the DBRef to get the referenced document
                referenced_document = db.dereference(product['category'])
                if referenced_document is not None:
                    scraper_categories = []
                    hierarchicalScraperCategories = {}
                    sc = referenced_document['classification'].split(' >')
                    for index, ct in enumerate(sc):
                        scraper_categories.append({
                            'name': ct,
                            'level': index
                        })
                        hierarchicalScraperCategories[f"lvl{index}"] = ct

                    agl_prod["scraper_categories"] = scraper_categories
                    agl_prod["hierarchicalScraperCategories"] = hierarchicalScraperCategories

            
            update_data.append(agl_prod)

        index = ALGLA_client.init_index("sc_products")
        index.save_objects(update_data)
        return {'status': 'success'}
        