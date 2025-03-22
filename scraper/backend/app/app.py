import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from starlette.requests import Request

from app.models.user_model import User
from app.models.role_model import Role
from app.models.perm_model import Permission
from app.models.country_model import Country
from app.models.currency_model import Currency
from app.models.cust_type_model import CustomerType
from app.models.frequency_model import ScrapingFrequency
from app.models.language_model import Language
from app.models.customer_model import Customer
from app.models.api_model import API
from app.models.syn_plural_model import SynonymPlural
from app.models.product_model import Product
from app.models.excluded_word_model import ExcludedWord
from app.models.category_model import Category
from app.models.cluster_model import Cluster

from app.cron.scraper_cron import scheduler

from app.api.api_v1.router import router

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

origins = [
    "http://127.0.0.1:4002",
    "http://localhost:4002",
    "http://18.167.173.79:4002",
    "http://dev.yooox.tech:4002",
    "http://1000m.xyz:4002",
    "https://scrapper.1000miles.info",
    "https://scrapper.1000miles.info:4002"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the directory path
directory = "dist/assets"

# Create the directory if it doesn't exist
if not os.path.exists(directory):
    os.makedirs(directory)

app.mount("/files", StaticFiles(directory="static"), name="files")

app.mount("/assets", StaticFiles(directory=directory), name="assets")

# Initialize Jinja2 templates to render index.html
templates = Jinja2Templates(directory="dist")


@app.on_event("startup")
async def app_init():
    """
    initialize crucial applications services here
    """
    scheduler.start()
    db_client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING).scraper

    await init_beanie(
        database=db_client,
        document_models=[
            User,
            Role,
            Permission,
            Country,
            Currency,
            CustomerType,
            ScrapingFrequency,
            Language,
            Customer,
            API,
            SynonymPlural,
            Product,
            ExcludedWord,
            Category,
            Cluster,
        ],
    )


app.include_router(router, prefix=settings.API_V1_STR)


# # Route to serve the index.html file and handle other routes
@app.route("/dashboard/{full_path:path}")
@app.get("/")
async def serve_spa(request: Request, full_path: str = ""):
    # Render index.html using the Jinja2 template
    return templates.TemplateResponse("index.html", {"request": request})
