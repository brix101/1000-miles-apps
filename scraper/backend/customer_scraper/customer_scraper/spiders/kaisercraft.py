import scrapy

class KaisercraftSpider(scrapy.Spider):
    name = "kaisercraft"
    allowed_domains = ["kaisercraft.com.au"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request('https://www.kaisercraft.com.au/collections/new', callback=self.parse_item)
    
    def start_scraping(self, response):
        nav_items = response.css('a.header__menu-item.list-menu__item.link.link--text.focus-inset.caption-large')
        for nav in nav_items:
            link = nav.css('a').attrib['href']
            yield scrapy.Request('https://www.kaisercraft.com.au' + link, 
                                 callback=self.parse_item, 
                                 dont_filter=True,
                                 meta={
                                     'deltafetch_enabled': False
                                 })
    
    def parse_item(self, response):
        products = response.css('li.grid__item')
        for product in products:
            image = product.css('img.img-fluid.mx-auto.lazyload.abc').attrib['src']
            name_tag = product.css('h3.product-title') 
            name = name_tag.css('a::text').get()
            price_tag = product.css('span.price-item.price-item--regular::text').get()
            price = price_tag.replace('AUD','')
            price = price.strip()

            categories = []
            category_nav = response.css('nav.breadcrumb.row')
            spans = category_nav.css('span')
            categs = spans[-1].css('span::text').get()
            count = 0
            for ct in categs.split('-'):
                categories.append({
                    'name': ct.strip(),
                    'level': count
                })
                count+=1

            data = {
                'image':'https:'+ image,
                'name': name,
                'price': float(price.replace('$', '')),
                'desciption': '',
                'categories': categories
            }
            url = product.css('a').attrib['href']
            yield scrapy.Request('https://www.kaisercraft.com.au' + url, 
                                 callback=self.parse_product,
                                 meta={
                                     'data':data
                                })

        next_page = response.css('a.button.pagination__item.pagination__item--prev.pagination__item-arrow.link.motion-reduce')
        if len(next_page)>0 or next_page is None:
            link = next_page.css('a').attrib['href']
            yield scrapy.Request('https://www.kaisercraft.com.au' + link, 
                                 callback=self.parse_item, 
                                 dont_filter=True,
                                 meta={
                                     'deltafetch_enabled': False
                                 })

    def parse_product(self, response):
        description = response.css('div.product__description')
        extracted_text = ''
        if len(description) > 0:
            text = response.css('div.product__description ::text').getall()
            filtered_text = [t.strip() for t in text if t.strip() != 'Description']
            extracted_text = ' '.join(filtered_text)

        yield{
            **response.meta.get('data'),
            'description': extracted_text
        }
        

