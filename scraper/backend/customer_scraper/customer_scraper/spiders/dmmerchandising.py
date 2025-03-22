# https://www.londondrugs.com/

import scrapy
import json
class DmMerchandisingSpider(scrapy.Spider):
    name = "dm_merchandising"
    allowed_domains = ["247dm.com"]
    collection_link_visited = []
    
    product_link_visited = []
    links_visited = []

    custom_settings = {
        'ROBOTSTXT_OBEY': False,
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request('https://www.247dm.com/catalog-d/', 
                              callback=self.start_scraping,meta={
                             'product_count': 0
                            })


    #  image, name, price, categories, description, review_score, review_number
    def start_scraping(self, response):
        product_count = response.meta.get('product_count')
        all_products_link = response.css('a.switch__tab.switch__tab_all::attr(href)').get()
        yield scrapy.Request('https://www.247dm.com' + all_products_link + "?o="+str(product_count)+"&s=Relevance&l=48", 
                             callback=self.parse_pagination, 
                             dont_filter=True,
                             meta={
                                 'deltafetch_enabled': False,
                                 'baselink': 'https://www.247dm.com' + all_products_link,
                                 'product_count': product_count + 48
                             })
        
    def parse_pagination(self, response):
        baselink = response.meta.get('baselink')
        product_count = response.meta.get('product_count')

        div = response.xpath('//div[@id="root" and not(@class)]')
        newdiv = div.css('::attr(data-state)').get()
        list_product_link = []
        data = json.loads(newdiv)
        for url in data['SearchResult']['Result']['Products']:
            list_product_link.append(url['ContentUrl'])
            if url['ContentUrl'] not in self.product_link_visited:
                self.product_link_visited.append(url['ContentUrl'])
                yield scrapy.Request('https://www.247dm.com' + url['ContentUrl'], 
                                     callback=self.parse_product, 
                                     meta={
                                         'baselink': 'https://www.247dm.com' + url['ContentUrl'],
                                     })

        if len(list_product_link) > 0:
            yield scrapy.Request(baselink + "?o="+str(product_count)+"&s=Relevance&l=48", 
                                 callback=self.parse_pagination, 
                                 dont_filter=True,
                                 meta={
                                     'deltafetch_enabled': False,
                                     'baselink': baselink,
                                     'product_count': product_count + 48
                                 })

    def parse_product(self, response):
        baselink = response.meta.get('baselink')
        div = response.css('div.pdp-information-carousel-slide-inner')
        image = div.css('img.pdp-information-carousel-slide-img.js-information-slide::attr(src)').get()
        text = response.css('div.pdp-information-configuration.js-configuration::attr(data-products)').getall()
        data = json.loads(text[0])
        description = ''
        product_name = ''
        review_score = ''
        review_number = ''
        if len(data) > 0:
            try:
                description = data[0]['DescriptionText'].replace("<h1>", " ").replace("</h1>", " ").replace("<li>", " ").replace("</li>", " ").replace("<em>", " ").replace("</em>", " ").replace("<ul>", " ").replace("</ul>", " ").replace("<p>", " ").replace("</p>", " ").replace("&rsquo;", "'")
            except:
                description = ''
            product_name = data[0]['Title']
            review_score = data[0]['Rating']
            review_number = data[0]['ReviewCount']
        category_final_list = []
        count = 0
        categorylistpartial = response.css('a.breadcrumb-link::text').getall()
        for cat in categorylistpartial:
            category_final_list.append({
                "level": count,
                'name': cat.replace("\r\n", "").strip(),
            })
            count = count + 1

        yield{
            "image": "https://www.247dm.com" + image,
            "name": product_name,
            "price": 0.0,
            "description": description,
            "review_number": review_number,
            "review_score": review_score,
            "categories": category_final_list,
        }
        
  
            
       


        