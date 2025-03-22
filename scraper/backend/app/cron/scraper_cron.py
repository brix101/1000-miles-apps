from fastapi import FastAPI
from fastapi_amis_admin.admin.settings import Settings
from fastapi_amis_admin.admin.site import AdminSite
from datetime import datetime
from fastapi_scheduler import SchedulerAdmin
from apscheduler.schedulers.background import BackgroundScheduler
from app.services.customer_service import CustomerService
from app.services.api_service import APIService
from apscheduler.schedulers.asyncio import AsyncIOScheduler 
import pytz

timezone = pytz.timezone('Asia/Singapore')


async def scrape_cron():
    await APIService.update_currency_value()
    customers = await CustomerService.list_customers()
    for customer in customers:
        days = customer['frequency']['days']
        if 'last_scraped' in customer and customer['last_scraped'] is not None:
            last_scraped = customer['last_scraped']
            now = datetime.utcnow()
            difference = now - last_scraped
            days_difference = difference.days
            if days_difference >= days:
                await CustomerService.scrape_now(customer['_id'])
        
        else:
            await CustomerService.scrape_now(customer['_id'])



scheduler = AsyncIOScheduler(timezone=timezone)
scheduler.add_job(scrape_cron, 'cron', hour=22)

