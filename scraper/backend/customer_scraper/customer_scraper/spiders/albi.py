import scrapy
import requests

class AlbiSpider(scrapy.Spider):
    name = "albi"
    allowed_domains = ["eshop.albi.cz"]

    urls = []

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }


    def start_requests(self):
        yield scrapy.Request('https://eshop.albi.cz/', 
                             callback=self.parse_category)
    
    def parse_category(self, response):
        navigations = response.css('a.rf-Navigation-link')
        for navigation in navigations:
            link = navigation.css('a').attrib['href']
            link = 'https://eshop.albi.cz' + link
            yield scrapy.Request(link,
                                 callback=self.parse_sub_category,
                                 meta={
                                     'deltafetch_enabled': False
                                 })
        
    def parse_sub_category(self, response):
        categoriesUl = response.css('ul.js-filterItems')
        categoriesLi = categoriesUl.css('li')
        for li in categoriesLi:
            aTag = li.css('a').attrib['href']
            link = 'https://eshop.albi.cz' + aTag
            yield scrapy.Request(link,
                                 callback=self.parse_sub_category_item,
                                 meta={
                                     'deltafetch_enabled': False
                                 })
    
    def parse_sub_category_item(self, response):
        treeOpen = response.css('li.jstree-node.jstree-open')
        treeUl = treeOpen.css('ul')
        treeLi = treeUl.css('li')
        for li in treeLi:
            aTag = li.css('a').attrib['href']
            link = "https://eshop.albi.cz" + aTag
            if link not in self.urls:
                self.urls.append(link)
                yield scrapy.Request(link,
                                     callback=self.parse_item,
                                     meta={
                                         'deltafetch_enabled': False
                                     })

    def parse_item(self, response):
        productsDiv = response.css('div#productList')
        products =productsDiv.css('div.rf-ProductCard')
        for product in products:
            aTag = product.css('a.rf-h-stretchedLink').attrib['href']
            link = 'https://eshop.albi.cz/' + aTag
            yield scrapy.Request(link,
                                 callback=self.parse_product)
        
        nextPageDiv = response.css('ul.rf-Pagination')
        try:
            nextPage = nextPageDiv.css('a.rf-Pagination-link.rf-Pagination-link--next').attrib['href']
            link = 'https://eshop.albi.cz' + nextPage
            yield scrapy.Request(link,
                                 callback=self.parse_item,
                                 dont_filter=True,
                                 meta={
                                     'deltafetch_enabled': False
                                 })
        
        except Exception as e:
            pass
    
    def parse_product(self, response):
        categoryDiv = response.css('div.rf-Breadcrumb')
        categoriesTag = categoryDiv.css('a.rf-Breadcrumb-link')
        categories = []
        for index,ct in enumerate(categoriesTag):
            ct_name = ct.css('a::text').get()
            ct_name = ct_name.strip()
            categories.append({
                'name': ct_name,
                'level': index
            })

        categories.pop()

        imageImg = response.css('div.ProductGallery-thumb--main')
        image = imageImg.css('a').attrib['href']
        nameDiv = response.css('h1.Product-title::text').get()
        name = nameDiv.strip()
        priceSpan = response.css('span.rf-Price.Product-price').attrib['content']
        price_strip = priceSpan.strip()
        price = float(price_strip)
        descriptionText = response.css('div.Product-text-short::text').get()
        description = descriptionText.strip()

        yield{
            'image': 'https://eshop.albi.cz' + image,
            'name': name,
            'price': price,
            'description': description,
            'categories': categories,
            'review_score': 0,
            'review_number': 0
        }

        

        
        

