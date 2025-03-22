import scrapy
import requests

class CardFatorySpider(scrapy.Spider):
    name = "cardfactory"
    allowed_domains = ["cardfactory.co.uk"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request('https://www.cardfactory.co.uk/', 
                             callback=self.start_parse,
                             meta={
                                 'deltafetch_enabled': False
                             })

    def start_parse(self, response):
        categories = response.css('li.b-navigation__submenu-item.m-level-2')
        for category in categories:
            href = category.css('a').attrib['href']
            link = 'https://www.cardfactory.co.uk' + href
            yield scrapy.Request(link, 
                                 callback=self.parse_item,
                                 meta={
                                     'url': link, 
                                     'page':1,
                                     'deltafetch_enabled': False
                                     })

    def parse_item(self, response):
    
        products = response.css('div.l-product-grid__item.js-product-grid-item')
        count_div = response.css('div.b-results-count')
        total = count_div.css('b::text').get().strip().replace(',','') if response.css('b::text').get()!=None else 0
        show_more_div = response.css('a.b-show-more__button.btn.btn-secondary.js-show-more')
        show_more = show_more_div.attrib['href'] if show_more_div.get() !=None else None
        if show_more!=None:
            url = response.meta.get('url')
            if url[-1] == '/':
                url = url + '?page=%s' % int(int(total)/2)
            else:
                url = url + '&page=%s' % int(int(total)/2)
            yield scrapy.Request(url, 
                                 callback=self.parset, 
                                 meta={
                                     'url': response.meta.get('url'), 
                                     'page':response.meta.get('page')+1,
                                     'deltafetch_enabled': False
                                     })
            
        

    def parset(self, response):
        products = response.css('div.l-product-grid__item.js-product-grid-item')
        for product in products:
            link  = product.css('a').attrib['href']
            image = product.css('img.js-tile-image-img.b-product-picture__image').attrib['src']
            yield scrapy.Request('https://www.cardfactory.co.uk' + link, 
                                 callback=self.parse_product, 
                                 meta={
                                     'image': image
                                     })
    
            
    
        
    def parse_product(self, response):
        breadcrumbs = response.css('li.b-breadcrumbs__item.i-chevron-left')
        categories = []
        for i in range(1, len(breadcrumbs)):
            namec = breadcrumbs[i].css('a::text').get().strip()
            categories.append({
                'name' : namec.lower(),
                'level': i-1
            })
        image = response.meta.get('image')
        name = response.css('h1.b-product__name.js-product-name::text').get()
        price = response.css('span.b-product-pricing__number.js-price-number::text').get()
        text = response.xpath('//section[@class="js-long-description"]//text()').getall()
        description = " ".join(text).strip()
        review_score = response.css('div.feefo-rating-stars::text').getall()
        review_score = ''.join(review_score).strip()
        review_desp = response.css('div.summary-bottom')
        review_b = review_desp.css('b')
        num_reviews = review_b[-1].css('b::text').get() if len(review_b)>1 else None

        headers = {'Accept': 'application/json'}
        try:
            cf_id = response.css('div.feefo-review-widget-product').attrib['data-product-sku'].strip()
            r = requests.get(f"https://api.feefo.com/api/10/reviews/product?page=1&page_size=5&since_period=YEAR&full_thread=include&unanswered_feedback=include&source=on_page_product_integration&sort=-updated_date&feefo_parameters=include&media=include&merchant_identifier=card-factory&origin=www.cardfactory.co.uk&product_sku={cf_id}", headers=headers)
            reviews = r.json()
            total = 0
            num = 0
            for rw in reviews['reviews']:
                total += rw['products'][0]['rating']['rating']
                num+=1
            reviews_num = reviews['summary']['meta']['count']
        except Exception as e:
            total = 0
            num = 0
            reviews_num = 0

        yield{
            'image': image,
            'name': name.strip() if name!=None else '',
            'price': float(price.strip()) if price!=None else 0,
            'categories': categories,
            'description': description,
            'review_score': total/num if num!=0 else 0,
            'review_number': reviews_num
        }
