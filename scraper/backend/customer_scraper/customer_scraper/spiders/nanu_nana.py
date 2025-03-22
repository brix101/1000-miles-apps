import scrapy

class NanuNanaSpider(scrapy.Spider):
    name = "nanu_nana"
    allowed_domains = ["nanu-nana.de"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request('https://www.nanu-nana.de/', callback=self.start_parse)

    def start_parse(self, response):
        navigations = response.css('a.level-top')
        for nav in navigations:
            categ = nav.css('span::text').get()
            href = nav.attrib['href']
            if categ!=None and categ.strip()=='Inspiration':
                    yield scrapy.Request(href, 
                                         callback=self.inspiration, 
                                         dont_filter=True,
                                         meta={
                                             'deltafetch_enabled': False
                                         })
            else:
                yield scrapy.Request(href, 
                                     callback=self.categ_scraping, 
                                     dont_filter=True,
                                     meta={
                                         'deltafetch_enabled': False
                                     })

    def categ_scraping(self, response):
        subs = response.css('a.bubble-filter_item')
        if len(subs)>0:
            for sub in subs:
                ref = sub.css('a').attrib['href']
                text = sub.css('a::text').get()
                if text!=None and text.strip()=='Einrichtungsstile':
                    yield scrapy.Request(ref, 
                                         callback=self.inspi_scrape, 
                                         dont_filter=True,
                                         meta={
                                             'deltafetch_enabled': False
                                         })
                else:
                    yield scrapy.Request(ref, 
                                         callback=self.categ_scraping, 
                                         dont_filter=True,
                                         meta={
                                             'deltafetch_enabled': False
                                         })
        else:
            yield scrapy.Request(response.request.url, 
                                 callback=self.parse_item, 
                                 dont_filter=True,
                                 meta={
                                     'deltafetch_enabled': False
                                 })

    
    def inspiration(self, response):
        group = response.css('div.pagebuilder-column-group')
        navs = group.css('figure')
        url = response.request.url
        for nav in navs:
            refer = nav.css('a').attrib['href']
            yield scrapy.Request(url+refer, 
                                 callback=self.inspi_scrape, 
                                 dont_filter=True,
                                 meta={
                                     'deltafetch_enabled': False
                                 })
    
    def inspi_scrape(self, response):
        div = response.css('div.category-description')
        figures = div.css('figure')
        breadcrumps = response.css('div.breadcrumbs')
        ein = breadcrumps.css('li.item')
        parent = ein[1].css('a::text').get().strip() if ein[1].css('a::text').get()!=None else ''
        url = response.request.url
        for figure in figures:
            refer = figure.css('a').attrib['href']
            if 'Wohnen & Einrichten' in parent:
                yield scrapy.Request('https://www.nanu-nana.de'+ refer, 
                                     callback=self.parse_item, 
                                     dont_filter=True,
                                     meta={
                                         'deltafetch_enabled': False
                                     })
            else:
                yield scrapy.Request(url+refer, 
                                     callback=self.parse_item, 
                                     dont_filter=True,
                                     meta={
                                         'deltafetch_enabled': False
                                     })


    def parse_item(self, response):
        products = response.css('div.product-card')
        breadcrumps = response.css('div.breadcrumbs')
        categs = breadcrumps.css('li.item')
        categories = []
        index = 0
        for i in range(1,len(categs)):
            category = categs[i].css('a::text').get() if categs[i].css('a::text').get()!=None else categs[i].css('strong::text').get() 
            categories.append({ 'name': category.strip() if category !=None else '', 'level': index })
            index += 1

        for prod in products:
            name = prod.css('span.product-name::text').get()
            price =prod.css('span.price::text').get()
            special_price = prod.css('span.special-price')
            if len(special_price)>0:
                price = special_price.css('span.price::text').get()
            price_fn = price.strip().split(' ')[0].replace('€', '').strip().replace(".", "").replace(",",".") if price!=None else 0
            product = {
                'image': prod.css('img').attrib['src'],
                'name': name.strip() if name!=None else '',
                'price': float(price_fn) if price_fn!=None else 0,
                'categories': categories,
            }
            link = prod.css('a.js-product-card').attrib['href']
            yield scrapy.Request(link, 
                                 callback=self.parse_product, 
                                 meta={
                                     'product': product
                                 })

        next_page = response.css('a.action.next')
        if len(next_page)>0:
            nextp = next_page.attrib['href']
            yield response.follow(nextp, 
                                  callback=self.parse_item,
                                  meta={
                                      'deltafetch_enabled': False
                                  })


    def parse_product(self, response):
        description_div = response.css('div.product.attribute.description')
        description =  description_div.css('div.value::text').get()
        yield{
                **response.meta.get('product'),
                'description': description.strip() if description!=None else ''
            }