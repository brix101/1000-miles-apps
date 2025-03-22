import scrapy
from scrapy.http import FormRequest
import http.cookies


def cookie_parse(cookies):
    cookies_dict = {}
    for cookie in cookies:
        parsed_cookie = http.cookies.SimpleCookie()
        parsed_cookie.load(cookie.decode())
        for key, morsel in parsed_cookie.items():
            cookies_dict[key] = morsel.value
    return cookies_dict

class GanzSpider(scrapy.Spider):
    name = "ganz"
    allowed_domains = ["ganz.com"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": True,
    }

    def start_requests(self):
        url = 'https://www.ganz.com/new-search-page/'
        yield scrapy.Request(url,
                             callback=self.parse_product)
    
    def start_scraping(self, response):
        main_div = response.css('ul.nav.nav--primary.nav--depth-0')
        categs_div = main_div.css('li.nav__item')
        for i in range(1, len(categs_div)):
            categ = categs_div[i]
            a = categ.css('a.nav__link').attrib['href']
            link = 'https://www.ganz.com' + a
            cj_category = categ.css('span::text').get()
            cj_category = cj_category.strip().lower() if cj_category!=None else ''
            yield scrapy.Request(link, 
                                callback=self.parse_product, 
                                meta={
                                    'deltafetch_enabled': False,
                                    'page': 2,
                                    'cookiejar': cj_category
                                    }
                                )

    def parse_product(self, response):
        cookies = response.headers.getlist('Set-Cookie')
        categs = response.css('article.thumbnail.thumbnail--category.xs-6.sm-3')
        # if len(categs) > 0 :
        #     for item in categs:
        #         a = item.css('a.thumbnail__imageLink').attrib['href']
        #         link = 'https://www.ganz.com' + a
        #         cj_category = item.css('img').attrib['alt']
        #         if cj_category!=None:
        #             cj_category = cj_category.strip().lower()
        #         yield scrapy.Request(link,  
        #                              callback=self.parse_product, 
        #                              cookies= cookie_parse(cookies) ,
        #                              dont_filter=True,
        #                              meta={ 
        #                                  'page': 2,
        #                                  'cookiejar': cj_category
        #                                  }
        #                             )

        # else:
        sub_category = ''
        products = response.css('article.thumbnail.thumbnail--product.thumbnail--variant.speedShopProduct.xs-6.md-4.lg-4')
        for product in products:
            image = product.css('img.thumbnail__image').attrib['src']
            image = 'https://www.ganz.com' + image
            name = product.css('a.thumbnail__nameLink::text').get()
            name = name.strip() if name!=None else ''
            category_div = response.css('ul.nav.nav--breadcrumb')
            ct = category_div.css('li.nav__item')
            categories = []
            for index, li in enumerate(ct):
                if index > 0:
                    category = li.css('a::text').get() if len(ct)>1 else None
                    category = category.strip() if category!=None else None
                    if category is None:
                        category = li.css('span::text').get()
                        if category is None:
                            category = li.css('li::text').get()
                            category = category.strip() if category!=None else ''
                        else:
                            category = category.strip()
                    categories.append({
                        'name': category,
                        'level': index-1
                    })
                
            to_data = {
                'image': image,
                'name': name,
                'price': 0,
                'categories':categories,
                'description': ''
            }
            link = product.css('a.thumbnail__imageLink').attrib['href']
            link = 'https://www.ganz.com' + link
            yield scrapy.Request(link, 
                                 callback=self.item_parse, 
                                 meta={
                                     'data': to_data,
                                     'cookiejar': name
                                 })

        next_=  response.css('li.paging__page.paging__page--next')
        if len(next_)>0:
            num = response.meta.get('page')
            url = response.request.url
            url = url.replace('?pageNumber=%s'% (num-1), '')
            link = url + '?pageNumber=%s' % num
            yield response.follow(link, 
                                    callback=self.parse_product, 
                                    cookies= cookie_parse(cookies) ,
                                    meta={
                                        'deltafetch_enabled': False,
                                        'page': response.meta.get('page')+1,
                                        'cookiejar': sub_category
                                        }
                                    )
        
    def item_parse(self, response):
        data = response.meta.get('data')
        yield data
        


    
