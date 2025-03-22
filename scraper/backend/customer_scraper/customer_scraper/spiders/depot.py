import scrapy

urls_ = [
    'https://www.depot-online.de/de/c/neu-653',
    'https://www.depot-online.de/de/c/balkon-garten-299',
    'https://www.depot-online.de/de/c/deko-wohnen-486',
    'https://www.depot-online.de/de/c/textilien-500',
    'https://www.depot-online.de/de/c/tisch-kueche-1',
    'https://www.depot-online.de/de/c/moebel-69',
    'https://www.depot-online.de/de/c/geschenke-party-99',
    'https://www.depot-online.de/de/c/raumduft-ipuro-550',
    'https://www.depot-online.de/de/c/sale-271',
    'https://www.depot-online.de/de/c/anlaesse-5232'
]

urls = [
    'https://www.depot-online.de/de/c/neu-653'
]

class DepotAllSpider(scrapy.Spider):
    name = "depot_all"
    allowed_domains = ["depot-online.de"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        for url in urls:
            yield scrapy.Request(url, 
                                 callback=self.start_parse,
                                 meta={
                                     'deltafetch_enabled': False
                                 })

    
    def start_parse(self, response):
        categories = response.css('div.category-node')
        for category in categories:
            link = category.css('a').attrib['href']
            yield scrapy.Request('https://www.depot-online.de' + link, 
                                 callback=self.start_parse,
                                 meta={
                                     'deltafetch_enabled': False
                                 })

        if len(categories)<1:
            products = response.css('div.product-tile')
            categories_nav = response.css('a.breadcrumbs__nav-link.ng-star-inserted')
            categories = []
            for index, category in enumerate(categories_nav):
                ct_name = category.css('a::text').get()
                ct_name = ct_name.strip()
                categories.append({
                    'level': index,
                    'name': ct_name
                })
            main_categ = response.css('h1.headline::text').get()
            if main_categ is not None:
                categories.append({
                    'level': len(categories),
                    'name': main_categ.strip().lower()
                })

            for prod in products:
                image = prod.css('img').attrib['src']
                name = prod.css('div.product-tile__title.ng-star-inserted::text').get()
                price = prod.css('div.product-tile-price__new-price.ng-star-inserted::text').get()
                pricea = prod.css('div.product-tile-price__current-price.ng-star-inserted::text').get()
                price_strip = pricea.replace('€', '').strip().replace(".", "").replace(",",".") if pricea!=None else 0
                price = float(price_strip)
                if price<1:
                    price = prod.css('div.product-tile-price.ng-star-inserted::text').get()
                    pricea = prod.css('div.product-tile-price__original-price.ng-star-inserted::text').get()
                    price_strip = pricea.replace('€', '').strip().replace(".", "").replace(",",".") if pricea!=None else 0
                    price = float(price_strip)

                to_data = {
                    'image': image,
                    'name': name,
                    'description': '',
                    'price': price,
                    'categories': categories
                }      
                link = prod.css('a.product-tile__link').attrib['href']
                link = 'https://www.depot-online.de' + link if 'https://www.depot-online.de' not in link else link
                yield scrapy.Request(link, 
                                     callback=self.parse_product,
                                     meta={
                                         'data': to_data
                                     })


            next_page = response.css('a.pagination__link.pagination__border-link')     
            if len(next_page) > 1:
                next_ = next_page[1].css('a').attrib['href']
                yield response.follow(next_, 
                                      callback=self.start_parse,
                                      meta={
                                          'deltafetch_enabled': False
                                      })
                
    
    def parse_product(self, response):
        data = response.meta.get('data')
        yield data
