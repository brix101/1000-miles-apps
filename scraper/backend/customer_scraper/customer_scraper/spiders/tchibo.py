import scrapy
import requests

headers = {'Accept': 'application/json'}

class TchiboSpider(scrapy.Spider):
    name = "tchibo"
    allowed_domains = ["tchibo.de"]
    start_urls = ["https://tchibo.de"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request('https://www.tchibo.de', 
                            callback=self.parse_item)

    def parse_item(self,response):
        r = requests.get(f"https://www.tchibo.de/jsonflyoutnavigation", headers=headers)
        categories = r.json()
        categories = categories['list'][0]['children']
        for ct in categories:
            link = ct['href']
            parent_category = ct['title']
            subs = ct['children']
            for sub in subs:
                sub_category = sub['title']
                href = sub['href']
                if '-c' in href:
                    idTemp = href.split('-c')
                    idText = idTemp[-1].replace('.html','')
                    id_ = idText.strip()
                    link_ct = 'https://www.tchibo.de/' + href if 'https://www.tchibo.de/' not in href else href
                    final_categories = [
                        {
                            'name': parent_category,
                            'level': 0
                        },
                        {
                            'name': sub_category,
                            'level': 0
                        }
                    ]
                    yield scrapy.Request(link_ct,
                                         callback= self.parse_products,
                                         meta = {
                                            'categories': final_categories,
                                            'id': id_,
                                            'page': 1,
                                            'deltafetch_enabled': False
                                         })


    
    def parse_products(self, response):
        id_ = response.meta.get('id')
        categories = response.meta.get('categories')
        page = response.meta.get('page')
        data = requests.get(f"https://www.tchibo.de/service/categoryfrontend/api/categories?id={id_}&site=DE&page={page}&sorting=relevance&isPreview=false&previewTime=", headers=headers)
        items = data.json()
        if 'items' in items:
            products = items['items']
            while len(products) > 0:
                for product in products:
                    link = product['productViewUrl']
                    link = 'https://www.tchibo.de' + link if 'https://www.tchibo.de' not in link else link
                    yield scrapy.Request(link,
                                        callback= self.parse_product,
                                        meta = {
                                        'categories': categories,
                                        'data': product
                                        })
                
                page = page+1
                data = requests.get(f"https://www.tchibo.de/service/categoryfrontend/api/categories?id={id_}&site=DE&page={page}&sorting=relevance&isPreview=false&previewTime=", headers=headers)
                items = data.json()
                if 'items' in items:
                    products = items['items']
                else:
                    products = 0
    
            # if len(products) > 0:
            #     yield scrapy.Request(link,
            #                          callback= self.parse_products,
            #                          meta = {
            #                              'categories': categories,
            #                              'id': id_,
            #                              'page': page+1
            #                          })        
        
    def parse_product(self, response):
        categories = response.meta.get('categories')
        product = response.meta.get('data')
        name = product['title']
        image = 'https://www.tchibo.de' + product['imageUrlMediumSize']
        priceTemp = product['price']['current']
        number_str = str(priceTemp)
        price = 0
        if len(number_str) >= 2:
            modified_number_str = number_str[:-2] + '.' + number_str[-2:]
            price = float(modified_number_str)
        
        yield{
            'image': image,
            'name': name,
            'price': price,
            'categories': categories,
            'description': '',
            'review_score': 0,
            'review_number': 0
        }
            
