import scrapy


class ThaliaDeSpider(scrapy.Spider):
    name = "thalia"
    allowed_domains = ["thalia.de"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": True,
    }

    def start_requests(self):
        yield scrapy.Request("https://www.thalia.de", callback=self.start_parse)
    
    def start_parse(self, response):
        categoriesUl = response.css('ul.main-nav.no-bullets.no-scrollbar')
        categoriesLi = categoriesUl.css('li')
        for li in categoriesLi:
            link = li.css('a').attrib['href']
            link = 'https://www.thalia.de' + link if 'https://www.thalia.de' not in link else link
            yield scrapy.Request(link, 
                                 callback=self.parse_menu,
                                 meta={
                                     'deltafetch_enabled': False,
                                     'total': 0,
                                     'page' : 2
                                 })


    def parse_menu(self, response):
        menuDiv = response.css('ul.menu-list')
        menus = menuDiv.css('li')
        for menu in menus:
            link = menu.css('a').attrib['href']
            link = 'https://www.thalia.de' + link if 'https://www.thalia.de' not in link else link
            yield scrapy.Request(link, 
                                 callback=self.parse_menu,
                                 meta={
                                     'deltafetch_enabled': False,
                                     'total': 0,
                                     'page' : 2
                                 })
            
        
        title = response.css('h1.element-headline-large.layout-headline::text').get()
        title = title.strip().lower() if title is not None else None
        if title == 'tolino' or title == 'unterhaltung':
            print('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
            kategories = response.css('li.kategorie')
            for kt in kategories:
                link = kt.css('a').attrib['href']
                link = 'https://www.thalia.de' + link if 'https://www.thalia.de' not in link else link
                yield scrapy.Request(link, 
                                    callback=self.parse_menu,
                                    meta={
                                        'deltafetch_enabled': False,
                                        'total': 0,
                                        'page' : 2
                                    })
        
        elif len(menus)<1:
            total_products = response.css('span.anzahl-treffer::text').get()
            total_products = float(total_products) if total_products is not None else 0
            productDiv = response.css('ul.tm-produktliste')
            products = productDiv.css('li.tm-produktliste__eintrag.artikel')
            total = response.meta.get('total') + len(products)
            print(total)
            for product in products:
                image = product.css('img.tm-artikelbild-wrapper__artikelbild').attrib['src']
                link = product.css('a').attrib['href']
                link = 'https://www.thalia.de' + link if 'https://www.thalia.de' not in link else link
                yield scrapy.Request(link, 
                                     callback=self.product,
                                     meta={
                                         'image': image
                                     })
            
            if total < total_products:
                page = response.meta.get('page')
                link = f"{response.url}?sort=sfva&ajax=true&allayout=GRID&pagesize=24&p={page}"
                yield scrapy.Request(link, 
                                     callback=self.pagination,
                                     meta={
                                         'deltafetch_enabled': False,
                                         'page': page + 1,
                                         'total': total,
                                         'total_products': total_products,
                                         'link': response.url
                                     })

                
    def pagination(self, response):
        total_products = response.meta.get('total_products')
        url = response.meta.get('link')
        products = response.css('li.tm-produktliste__eintrag.artikel')
        total = response.meta.get('total') + len(products)
        print(total)
        for product in products:
            image = product.css('img.tm-artikelbild-wrapper__artikelbild').attrib['src']
            link = product.css('a').attrib['href']
            link = 'https://www.thalia.de' + link if 'https://www.thalia.de' not in link else link
            yield scrapy.Request(link, 
                                    callback=self.product,
                                    meta={
                                        'image': image
                                    })
        
        if total < total_products:
            page = response.meta.get('page')
            link = f"{url}?sort=sfva&ajax=true&allayout=GRID&pagesize=24&p={page}"
            yield scrapy.Request(link, 
                                    callback=self.pagination,
                                    meta={
                                        'deltafetch_enabled': False,
                                        'page': page + 1,
                                        'total': total,
                                        'total_products': total_products,
                                        'link': url
                                    })
                
    

    def product(self, response):
        image = response.meta.get('image')
        nameTemp = response.css('h1.element-headline-large.titel::text').get()
        name = nameTemp.strip()

        priceDiv = response.css('div.preis')
        try:
            priceTemp = priceDiv.css('p.element-headline-medium::text').get()
            priceClean = priceTemp.replace('€', '')
            price = priceClean.strip().replace(".", "").replace(",",".") if priceClean!=None else 0
            price = float(price)
        except Exception as e:
            try:
                priceTemp = priceDiv.css('p.element-headline-medium-sale::text').get()
                priceClean = priceTemp.replace('€', '')
                price = priceClean.strip().replace(".", "").replace(",",".") if priceClean!=None else 0
                price = float(price)
            except Exception as ex:
                price = 0

        description = ' '
        try:
            descriptionAll = response.css('div.zusatztexte::text').getall()
            descriptions = ' '.join(descriptionAll).strip()
            description = descriptions.split('.')[0]
        except Exception as e:
            pass

        review_score = 0
        review_num = 0
        
        reviewDiv = response.css('div.bewertungsstatistik')
        try:
            reviewScore = reviewDiv.css('span.element-rating-standard').attrib['rating']
            reviewStemp = reviewScore.replace(',','.')
            review_score = float(reviewStemp.strip())
        except Exception as e:
            pass

        try:
            reviewNum = reviewDiv.css('button::text').get()
            reviewNum = reviewNum.replace('(','')
            reviewNum = reviewNum.replace(')','')
            review_num = float(reviewNum.strip())
        except Exception as e:
            pass
        
        categories = []
        breadcrumbs = response.css('ul.breadcrumb-list')
        breadcrumbsLi = breadcrumbs.css('li')
        for index,li in enumerate(breadcrumbsLi):
            cts = li.css('a::text').getall()
            ct_name = ''
            if len(cts) > 1:
                ct_name = cts[1]
            else:
                ct_name = cts[0]
            ct_name = ct_name.strip()
            categories.append({
                "name": ct_name,
                "level": index
            })

        yield{
            'image': image,
            'name': name,
            'price': price,
            'description': description,
            'categories': categories,
            'review_score': review_score,
            'review_number': review_num
        }

        


