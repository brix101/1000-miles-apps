import scrapy

class GiftcrawlSpider(scrapy.Spider):
    name = "giftcraft"
    allowed_domains = ["giftcraft.com"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        payload = {
            'GuesCheckout': 'login',
            'ShowForgetPassword': 'True',
            'Email': self.username,
            'Password': self.password,
            'RememberMe': 'false',
        }
        login_url = 'https://www.giftcraft.com/en/log-in/'
        yield scrapy.FormRequest(login_url,
                                 formdata=payload,
                                 callback=self.start_scraping)
        
    def start_scraping(self, response):
        yield scrapy.Request('https://www.giftcraft.com', 
                             callback=self.start_parsing,
                             meta={
                                 'deltafetch_enabled': False
                             })

    def start_parsing(self, response):
        primary_nav = response.css('nav.layout__primaryNav')
        if len(primary_nav) > 0:
            navigations = primary_nav.css('a.nav__link')
            for nav in navigations:
                url = nav.css('a.nav__link').attrib['href']
                categ = nav.css('a.nav__link::text').get()
                if nav.css('a.nav__link::text').get() != 'Sale':
                    yield scrapy.Request('https://www.giftcraft.com%s' % url, 
                                         callback=self.category_parsing,  
                                         meta={
                                             'category': categ,
                                             'deltafetch_enabled': False
                                         })

    def category_parsing(self, response):
        categ = response.meta.get('category')
        categ_nav = response.css('a.thumbnail__imageLink')
        for nav in categ_nav:
            url = nav.css('a.thumbnail__imageLink').attrib['href']
            name = nav.css('img.thumbnail__image').attrib['alt']
            if name.lower()!='all':
                yield scrapy.Request('https://www.giftcraft.com%s' % url, 
                                     callback=self.get_parse_data,
                                     meta={
                                         'deltafetch_enabled': False
                                     })

    def get_parse_data(self, response):
        for product in response.css('article.cartItem'):
            link = product.css('a.thumbnail__imageLink').attrib['href']
            price = product.css('span.price__value::text').get().strip() if len(product.css('span.price__value::text')) > 0 else ''
            price = price.replace('$','')
            data = {
                'image': product.css('img.thumbnail__image').attrib['src'],
                'name': product.css('a.thumbnail__nameLink::text').get(),
                'price': float(price),
            }
            yield scrapy.Request('https://www.giftcraft.com%s' % link, 
                                 callback=self.parse_product, 
                                 meta={
                                     'data': data
                                 })

        next_page = response.css('a.paging__pageLink.paging__pageLink--next')
        url = response.request.url
        current_url= url
        if len(next_page)>0:
            if 'pageNumber' in current_url:
                url = url.split('/')
                current_url = ''
                for i in range(len(url)-1):
                    current_url+=url[i]+'/'
            yield response.follow('%s%s' % (current_url, next_page[0].attrib['href']), 
                                  callback=self.get_parse_data,
                                  meta={
                                      'deltafetch_enabled': False
                                  })
    

    def parse_product(self, response):
        categories = []
        nav_item = response.css('ul.nav.nav--breadcrumb.nav--productBreadcrumb')
        items_li = nav_item.css('li')
        count = 0
        for item in items_li:
            a = item.css('a::text').get()
            category = ''
            if a!=None:
                category = a.strip()
            else:
                a = item.css('li::text').get()
                category = a.strip()
            
            categories.append({
                'name': category,
                'level': count
            })

            count += 1
        categories.pop()
        description = response.css('p.product__property.product__description::text').get()

        yield{
            **response.meta.get('data'),
            'categories': categories,
            'description': description
        }