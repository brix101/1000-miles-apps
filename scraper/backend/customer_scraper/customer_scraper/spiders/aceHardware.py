import scrapy
import requests

class AceHardwareSpider(scrapy.Spider):
    name = "acehardware"
    allowed_domains = ["acehardware.com"]

    urls = []

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request('https://www.acehardware.com/departments', 
                             callback=self.parse_item, 
                             meta={
                                 'url': 'https://www.acehardware.com/departments',
                                 'page':30
                             })

    def parse_item(self, response):
        categoriesUl = response.css('ul.mz-facetingform-facet.mz-facetingform-facet-hierarchy.mz-facetingform-hierarchy-wrap')
        if len(categoriesUl) > 1:
            categoriesLi = categoriesUl[-1].css('li')
            for li in categoriesLi:
                aTag = li.css('a').attrib['href']
                if aTag not in self.urls:
                    link = 'https://www.acehardware.com' + aTag if 'https://www.acehardware.com' not in aTag else aTag
                    self.urls.append(link)
                    yield scrapy.Request(link,
                                        callback=self.parse_item,
                                        meta={
                                            'deltafetch_enabled': False
                                        })
        else:
            return
        
        for url in self.urls:
            yield scrapy.Request(url,
                                 callback=self.parse_pill,
                                 dont_filter=True,
                                 meta={
                                     'deltafetch_enabled': False
                                 })
            
    
    def parse_pill(self, response):
        pills = response.css('a.pill')
        for pill in pills:
            aTag = pill.css('a.pill').attrib['href']
            link = 'https://www.acehardware.com' + aTag if 'https://www.acehardware.com' not in aTag else aTag
            yield scrapy.Request(link,
                                 callback=self.parse_products,
                                 dont_filter=True,
                                 meta={
                                     'url': link,
                                     'page': 30,
                                     'deltafetch_enabled': False
                                 })
        if len(pills) < 1:
            yield scrapy.Request(response.url,
                                 callback=self.parse_products,
                                 dont_filter=True,
                                 meta={
                                     'url': response.url,
                                     'page': 30,
                                     'deltafetch_enabled': False
                                 })


    def parse_products(self, response):
        categoriesUl = response.css('ul.mz-facetingform-facet.mz-facetingform-facet-hierarchy.mz-facetingform-hierarchy-wrap')
        if len(categoriesUl) < 1:
            page = response.meta.get('page')
            next_page =  response.css('input#loadMoreBtn')
            p_num = response.css('p.load-more-count::text').get()
            p_start = 0
            p_end = 0
            if p_num is not None:
                next_text = p_num.split(' ')
                p_start = float(next_text[1])
                p_end = float(next_text[3])
            
            if p_num is not None and p_start<p_end and page < 10000:
                ref = response.meta.get('url')
                link = f"{ref}?pageSize={page}"
                yield scrapy.Request(link,
                                    callback=self.parse_products,
                                    meta={
                                        'url': ref,
                                        'page': page + 30,
                                        'deltafetch_enabled': False
                                    })

            else:
                products = response.css('li.col-md-4.col-xs-6.mz-productlist-item')
                for product in products:
                    url = product.css('a').attrib['href']
                    yield scrapy.Request(url,
                                        callback=self.parse_product)

    
    def parse_product(self, response):
        breadcrumbs = response.css('div.mz-breadcrumbs')
        tags = breadcrumbs.css('a')
        categories = []
        for i, a in enumerate(tags):
            if i>0:
                c_text = a.css('a::text').get()
                c_name = c_text.strip()
                categories.append({
                    'name':c_name,
                    'level': i-1
                })

        image_div = response.css('div.swiper-zoom-container.swiper-desktop-zoom')
        image = image_div.css('img').attrib['src']
        image = 'https:' + image
        
        name_div = response.css('div.mz-productHeader.mz-mobile-center.hidden-sm.hidden-xs')
        name = name_div.css('h1.mz-pagetitle::text').get()
        if name is None:
            name = response.css('h1.mz-pagetitle.hidden-sm.hidden-xs::text').get()
        name = name.strip()

        descriptions = response.css('meta')
        description = ''
        for des in descriptions:
            text = des.get()
            if 'description' in text:
                description = des.css('meta').attrib['content']
                description = description.strip()
                
        try:
            price_div = response.css('div.pdpSectionPrice')
            price_text = price_div.css('span.custom-price.mz-price::text').get()
            price_ = price_text.replace('$','')
            price_ = price_.replace(',','')
            price_strip = price_.strip()
            price = float(price_strip)
        
        except Exception as e:
            try:
                price_div = response.css('div.pdpSectionPrice')
                price_text = price_div.css('div.sales-price::text').get()
                price_ = price_text.replace('$','')
                price_ = price_.replace(',','')
                price_strip = price_.strip()
                price = float(price_strip)
            
            except Exception as ie:
                price_div = response.css('div.pdpSectionPrice')
                price_text = price_div.css('div.price-value::text').get()
                if price_text is None:
                    price_text = response.css('div.mz-pricestack.mz-pricestack-range.mz-bundleItem-pricestack::text').get()
                    price_text = price_text if price_text is not None else ''
                price_ = price_text.replace('$','')
                price_ = price_.replace(',','')
                price_strip = price_.strip()
                price = float(price_strip) if len(price_strip) > 0 else 0

        review_score = 0
        review_number = 0
        r_url = response.url.split('/')
        id_ = r_url[-1].replace('-Collection','')
        try:
            id_num = int(id_)
            headers = {'Accept': 'application/json'}
            reviews = requests.get(f"https://display.powerreviews.com/m/4403/l/en_US/product/{id_num}/snippet?apikey=516a63a6-9f21-4dbe-b9f4-edc4b7387ea7&_noconfig=true", headers=headers)
            data = reviews.json()
            if 'results' in data and len(data['results'])>0:
                review_score = data['results'][0]['rollup']['average_rating']
                review_number = data['results'][0]['rollup']['review_count']
        except Exception as e:
            pass

        yield{
            'image': image,
            'name': name,
            'price': price,
            'categories': categories,
            'review_score': review_score,
            'review_number': review_number,
            'description': description
        }