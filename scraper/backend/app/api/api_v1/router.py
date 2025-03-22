from fastapi import APIRouter
from app.api.api_v1.handlers import (
    user,
    role,
    perm,
    customer,
    country,
    currency,
    customer_type,
    frequency,
    language,
    api,
    syn_plural,
    product,
    excluded_word,
    category,
    cluster,
)
from app.api.auth.jwt import auth_router

router = APIRouter()

router.include_router(user.user_router, prefix="/users", tags=["users"])
router.include_router(
    category.category_router, prefix="/categories", tags=["categories"]
)
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(role.role_router, prefix="/roles", tags=["roles"])
router.include_router(perm.perm_router, prefix="/permissions", tags=["permissions"])
router.include_router(country.country_router, prefix="/countries", tags=["countries"])
router.include_router(
    currency.currency_router, prefix="/currencies", tags=["currencies"]
)
router.include_router(
    customer_type.cust_type_router, prefix="/customer-type", tags=["customer-type"]
)
router.include_router(
    frequency.frequency_router,
    prefix="/scraping-frequency",
    tags=["scraping-frequency"],
)
router.include_router(language.language_router, prefix="/languages", tags=["languages"])
router.include_router(customer.customer_router, prefix="/customers", tags=["customers"])
router.include_router(api.api_router, prefix="/scraper-api", tags=["scraper-api"])
router.include_router(
    syn_plural.syn_plural_router, prefix="/synonym-plural", tags=["synoym-plural"]
)
router.include_router(product.product_router, prefix="/products", tags=["products"])
router.include_router(
    excluded_word.ex_word_router, prefix="/excluded-words", tags=["excluded words"]
)
router.include_router(cluster.cluster_router, prefix="/clusters", tags=["clusters"])
