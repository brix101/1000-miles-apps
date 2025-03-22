import scrapy
import requests
import json

class GentlemensHardwareSpider(scrapy.Spider):
    name = "gentlemens_hardware"
    allowed_domains = ["gentlemenshardware.com"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }


    def start_requests(self):
        yield scrapy.Request('https://gentlemenshardware.com/', callback=self.parse_categories)
    
    def parse_categories(self, response):
        urls = []

        navigations = response.css('a.navlink.navlink--toplevel')
        for nav in navigations:
            category = nav.css('span::text').get()
            category = category.strip()
            aTag = nav.css('a').attrib['href']
            link = 'https://gentlemenshardware.com' + aTag
            urls.append(link)
            yield scrapy.Request(link,
                                 callback=self.parse_items,
                                 meta={
                                     'category': category,
                                     'deltafetch_enabled': False
                                 })

        navigations = response.css('a.navlink.navlink--grandchild')
        for nav in navigations:
            category = nav.css('span::text').get()
            category = category.strip()
            aTag = nav.css('a').attrib['href']
            link = 'https://gentlemenshardware.com' + aTag
            urls.append(link)
            yield scrapy.Request(link,
                                 callback=self.parse_items,
                                 meta={
                                     'category': category,
                                     'deltafetch_enabled': False
                                 })

        navigations = response.css('a.navlink.navlink--child')
        for nav in navigations:
            category = nav.css('span::text').get()
            category = category.strip()
            aTag = nav.css('a').attrib['href']
            link = 'https://gentlemenshardware.com' + aTag
            urls.append(link)
            yield scrapy.Request(link,
                                 callback=self.parse_items,
                                 meta={
                                     'category': category,
                                     'deltafetch_enabled': False
                                 })

            
    
    def parse_items(self, response):
        category = response.meta.get('category')
        products = response.css('div.product-item')
        for product in products:
            aTag = product.css('a.product-link').attrib['href']
            link = 'https://gentlemenshardware.com' + aTag
            yield scrapy.Request(link,
                                 callback= self.parse_product,
                                 meta={
                                     'category': category
                                 })

        nextPage = response.css('li.pagination-custom__arr')
        if len(nextPage)>1:
            aTag = nextPage[-1].css('a').attrib['href']
            link = 'https://gentlemenshardware.com' + aTag
            yield scrapy.Request(link,
                                 callback= self.parse_items,
                                 meta={
                                     'category': category,
                                     'deltafetch_enabled': False
                                 })


    def parse_product(self, response):
        category = response.meta.get('category')
        categories = [{
            'name': category,
            'level' : 0
        }]

        name = response.css('h1.product__title::text').get()
        name = name.strip()

        image = response.css('div.product__photo')
        image = image.css('img').attrib['data-src']
        image = 'https:' + image

        try:
            priceDiv = response.css('div.product__price')
            priceText = priceDiv.css('span::text').get()
            priceText = priceText.replace('$', '')
            priceText = priceText.strip()
            price = float(priceText)
        except Exception as e:
            priceDiv = response.css('div.product__price')
            priceText = priceDiv.css('span.product__price--strike::text').get()
            priceText = priceText.replace('$', '')
            priceText = priceText.strip()
            price = float(priceText)
        

        descriptionDiv = response.css('div.tab-content__entry')
        description = descriptionDiv.css('p::text').get()
        description = description.strip() if description is not None else ''

        yield{
            'image': image,
            'name': name,
            'price': price,
            'description': description,
            'categories': categories,
            'review_score': 0,
            'review_number': 0,
        }



        
