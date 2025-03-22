import scrapy
import requests
import json

class GentlemensHardwareSpider(scrapy.Spider):
    name = "uncommongoods"
    allowed_domains = ["uncommongoods.com"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": True,
        'DOWNLOAD_DELAY': 1
    }

    def start_requests(self):
        yield scrapy.Request('https://www.uncommongoods.com/this-just-in', 
                             callback=self.parse_item,
                             meta={
                                    "zyte_api": {
                                        "browserHtml": True,
                                        "actions": [
                                                {
                                                    "action": "scrollBottom",
                                                },
                                        ],
                                    },
                                    'deltafetch_enabled': False
                                }
                             )
    
    def parse_categories(self, response):
        headers = {'Accept': 'application/json'}
        reviews = requests.get(f"https://www.uncommongoods.com/lookup/sc/hp", headers=headers)
        data = reviews.json()
        urls = []
        for key, value in data.items():
            if key == 'B':
                for val in value['text-link-module']['sections']:
                    url = val['cta']['link']
                    if len(url) > 0:
                        if  'https://www.uncommongoods.com' not in url and url[0]!='/':
                            url = '/'+ url
                        link = 'https://www.uncommongoods.com' + url if 'https://www.uncommongoods.com' not in url else url
                        urls.append(link)
            elif key == 'D' or key == 'L':
                for val in value['brand-statement-module']['section']['ctas']:
                    url = val['link']
                    if len(url) > 0:
                        if  'https://www.uncommongoods.com' not in url and url[0]!='/':
                            url = '/'+ url
                        link = 'https://www.uncommongoods.com' + url if 'https://www.uncommongoods.com' not in url else url
                        urls.append(link)
            elif key == 'F':
                for val in value['small-feature-module']['sections']:
                    url = val['cta']['link']
                    if len(url) > 0:
                        if  'https://www.uncommongoods.com' not in url and url[0]!='/':
                            url = '/'+ url
                        link = 'https://www.uncommongoods.com' + url if 'https://www.uncommongoods.com' not in url else url
                        urls.append(link)
            elif key == 'H' or key == 'C' or key == 'K':
                for val in value['basic-story-module']['sections']:
                    url = val['cta']['link']
                    if len(url) > 0:
                        if  'https://www.uncommongoods.com' not in url and url[0]!='/':
                            url = '/'+ url
                        link = 'https://www.uncommongoods.com' + url if 'https://www.uncommongoods.com' not in url else url
                        urls.append(link)
            elif key == 'I':
                for val in value['bulletin-board-module']['sections']:
                    url = val['cta']['link']
                    if len(url) > 0:
                        if  'https://www.uncommongoods.com' not in url and url[0]!='/':
                            url = '/'+ url
                        link = 'https://www.uncommongoods.com' + url if 'https://www.uncommongoods.com' not in url else url
                        urls.append(link)
            elif key == 'J':
                for val in value['image-link-double-module']['sections']:
                    url = val['cta']['link']
                    if len(url) > 0:
                        if  'https://www.uncommongoods.com' not in url and url[0]!='/':
                            url = '/'+ url
                        link = 'https://www.uncommongoods.com' + url if 'https://www.uncommongoods.com' not in url else url
                        urls.append(link)
            elif key == 'N':
                for val1 in value['seo-link-module']:
                    for val in val1['sections']:
                        url = val['cta']['link']
                        if len(url) > 0:
                            if  'https://www.uncommongoods.com' not in url and url[0]!='/':
                                url = '/'+ url
                        link = 'https://www.uncommongoods.com' + url if 'https://www.uncommongoods.com' not in url else url
                        urls.append(link)
        
        for url in urls:
            yield scrapy.Request(url, 
                                    callback=self.parse_item,
                                    meta={
                                    "zyte_api": {
                                        "browserHtml": True,
                                        "actions": [
                                                {
                                                    "action": "scrollBottom",
                                                },
                                        ],
                                    },
                                    'deltafetch_enabled': False
                                })
        
    def parse_item(self, response):
        
        productGrid = response.css('ul.product-grid')
        products = productGrid.css('li')
        ids = '('
        ratings = {}
        for product in products:
            
            reviewDiv = product.css('span.body-small')
            star = reviewDiv.xpath('//meta[@itemprop="ratingValue"]/@content').get()
            count = reviewDiv.xpath('//span[@itemprop="reviewCount"]/text()').get()
            try:
                priceDiv = product.css('span.price')
                
                idT= priceDiv.css('link')
                id_ = idT[-1].css('link').attrib['data-flow-item-number']
                ids  = ids + id_ + ','
                ratings[id_] = {'review_score':0, 'review_number':0}
                ratings[id_]['review_score'] = float(star) if star is not None else 0
                ratings[id_]['review_number'] = float(count) if count is not None else 0
            except Exception as e:
                continue

        ids  = ids + ')'
        r = f"https://api.flow.io/uncommongoods/experiences/world/items/query?experience=world&country=PHL&currency=PHP&q=number in {ids}"
        headers = {'Accept': 'application/json'}
        data_ = requests.get(r, headers=headers)
        data = data_.json()
        for prod in data['items']:
            categories = []
            for index, ct in enumerate(prod['categories']):
                categories.append({
                    'name': ct,
                    'level': index
                })
            desc = prod['description'].split('.')
            yield{
                'image': prod['images'][0]['url'],
                'name': prod['name'],
                'price': prod['price']['amount'],
                'categories': categories,
                'decription': desc[0],
                'review_score': ratings[str(prod['number'])]['review_score'],
                'review_number': ratings[str(prod['number'])]['review_number'],
            }
            
        
        nextPage = response.css('app-pagination')
        text = response.css('p.body-small-caps.margin-lg.text-center::text').get()
        strips = text.split(' ')
        start = float(strips[2])
        end = float(strips[4])
        if start < end:
            aTags = nextPage.css('a')
            next_ = aTags[-1].css('a').attrib['aria-disabled']
            if next_ == 'false':
                link = aTags[-1].css('a').attrib['href']
                link = 'https://www.uncommongoods.com' + link
                yield scrapy.Request(link, 
                                     callback=self.parse_item,
                                     meta={
                                        "zyte_api": {
                                            "browserHtml": True,
                                            "actions": [
                                                {
                                                    "action": "scrollBottom",
                                                },
                                        ],
                                        },
                                        'deltafetch_enabled': False
                                     })
                