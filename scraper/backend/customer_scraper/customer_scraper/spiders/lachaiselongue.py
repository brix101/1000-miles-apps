import scrapy


class LachaiselongueSpider(scrapy.Spider):
    name = "lachaiselongue"
    allowed_domains = ["lachaiselongue.fr"]
    collection_link_visited = []
    productslist = []

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }
   

    def start_requests(self):
        yield scrapy.Request('https://www.lachaiselongue.fr/', callback=self.start_scraping)
    
    def start_scraping(self, response):
        
        nav_items = response.css('a.header__menu-item.header__menu-item.list-menu__item.link.link--text.focus-inset')
        
        for nav in nav_items:
            link = nav.css('a').attrib['href']
            if link not in self.collection_link_visited:
                self.collection_link_visited.append(link)
            page = 1
            yield scrapy.Request('https://www.lachaiselongue.fr' + link, 
                                 callback=self.parse_item, 
                                 dont_filter=True,
                                 meta={
                                     'deltafetch_enabled': False,
                                     'baselink': 'https://www.lachaiselongue.fr' + link,
                                     'page': page
                                    }
                                 )
        list_link = []
        pages_link = []
        collection_link = []
        
        links = response.css('span.mega-menu__link--level-2::attr(onclick)').getall()
        for link in links:
            string = link.replace("window.location.href='", "")
            string = string.replace("'", "")
            if string not in list_link:
                list_link.append(string)
                link_type = string.split("/")[1]
                if link_type == 'pages':
                    pages_link.append(string)            
                if link_type == 'collection':
                    collection_link.append(string)
                    if collection_link not in self.collection_link_visited:
                        self.collection_link_visited.append(collection_link)

        for pages in pages_link:
            yield scrapy.Request('https://www.lachaiselongue.fr' + pages, 
                        callback=self.get_parse_page, 
                        dont_filter=True,
                        meta={
                            'deltafetch_enabled': False,
                            'baselink': 'https://www.lachaiselongue.fr' + pages,
                            }
                        )
            
        for collectionlink in collection_link:
            if collectionlink not in self.collection_link_visited:
                    self.collection_link_visited.append(collectionlink)
                    page = 1
                    yield scrapy.Request('https://www.lachaiselongue.fr' + collectionlink, 
                                        callback=self.parse_item, 
                                        dont_filter=True,
                                        meta={
                                            'deltafetch_enabled': False,
                                            'baselink': 'https://www.lachaiselongue.fr' + collectionlink,
                                            'page': page
                                            }
                                        )
            
    def get_parse_page(self, response):
        baselink = response.meta.get('baselink')
        for link in response.xpath('//a'):
            href = link.xpath('@href').extract_first() 
            if isinstance(href, str):
                if 'collections' in href:
                    if href not in self.collection_link_visited:
                        self.collection_link_visited.append(href)
                        page = 1
                        yield scrapy.Request('https://www.lachaiselongue.fr' + href, 
                                            callback=self.parse_item, 
                                            dont_filter=True,
                                            meta={
                                                'deltafetch_enabled': False,
                                                'baselink': 'https://www.lachaiselongue.fr' + href,
                                                'page': page
                                                }
                                            )

    def parse_item(self, response):
        baselink = response.meta.get('baselink')
        page = response.meta.get('page')
        products = response.css('li.grid__item') 
        for product in products:
            try:
                url = product.css('a').attrib['href']
                yield scrapy.Request('https://www.lachaiselongue.fr' + str(url), 
                                     callback=self.parse_product
                                    )
            except:
                continue
            
        if len(products)>=22:
            page = page + 1
            yield scrapy.Request(baselink+ "?page=" + str(page), 
                                 callback=self.parse_item, 
                                 dont_filter=True,
                                 meta={
                                     'deltafetch_enabled': False,
                                     'baselink': baselink,
                                     'page': page
                                 })
            
    def parse_product(self, response):
        image = response.css("img.image-magnify-hover").attrib['src']
        image = image.split('?')[0]
        image = image[2:]
        name = response.css("h1.h3::text").get()
        price = response.css("span.price-item.price-item--regular::text").get()
        price = price.strip().split(' ')[0].replace('€', '').strip().replace(".", "").replace(",",".") if price!=None else None
        desc = response.css("div.accordion__content.rte p::text, div.accordion__content.rte strong::text").getall()
        desc = ''.join(desc)

        review_number = response.css('span.text--review::text').get()
        review_number = review_number.replace("(", "").replace(")", "")
        stars = response.css("i.spr-icon.spr-icon-star")
        catlist = []
        categories = response.css('nav.breadcrumb a::text').getall()
        if len(categories) == 3:
            catlist.append({
                'name': categories[2],
                'level': 0
            })

        yield{
            "image": image,
            "name": name,
            "price": price,
            "description": desc,
            "review_number": float(review_number),
            "review_score": len(stars),
            "categories": catlist,
            
        }

    
        


