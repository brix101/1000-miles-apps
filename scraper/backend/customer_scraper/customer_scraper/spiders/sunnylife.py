import scrapy

class SunnylifeSpider(scrapy.Spider):
    name = "sunnylife"
    allowed_domains = ["www.sunnylife.com.au"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request('https://www.sunnylife.com.au/', 
                             callback=self.start_parse
                             )
    
    def start_parse(self, response):
        menus = response.css('div.mobile-menu__sublinks')
        categories = response.css('a.header-nav__link')
        for index , menu in enumerate(menus):
            links = menu.css('a')
            category = 'COLLABS'
            if index<6:
                category = categories[index].css('a.header-nav__link::text').get()
            for link in links:
                src = link.css('a').attrib['href']
                yield scrapy.Request('https://www.sunnylife.com.au' + src, 
                                     callback=self.scrape_product, 
                                     meta={
                                         'category': category,
                                         'deltafetch_enabled': False
                                     })

    def scrape_product(self, response):
        products = response.css('li.sun-Hits-item')
        category = response.meta.get('category').strip() if response.meta.get('category') !=None else ''
        for prod in products:
            product_url = prod.css('a.product-tile__url').attrib['href']
            yield scrapy.Request('https://www.sunnylife.com.au' + product_url, 
                                 callback=self.parse_product, 
                                 meta={
                                     'category': category
                                 })
            

        next_page_li = response.css('li.sun-Pagination-item.sun-Pagination-item--nextPage')
        if len(next_page_li)>0:
            next_page = next_page_li.css('a.sun-Pagination-link').attrib['href']
            yield response.follow('https://www.sunnylife.com.au' + next_page, 
                                  callback=self.scrape_product, 
                                  meta={
                                      'category': category,
                                      'deltafetch_enabled': False
                                 })


    def parse_product(self, response):
        top_category = response.meta.get('category')
        categories = []
        if top_category is not None:
            category = top_category.strip()
            categories.append({
                'name': category.lower(),
                'level': 0
            })
        categs_nav = response.css('nav.breadcrumb-wrapper')
        categ = categs_nav.css('span.bread-slug')
        temp_categ = categ.css('a::text').get()
        if temp_categ is not None:
            category = temp_categ.strip()
            categories.append({
                'name': category.lower(),
                'level': len(categories)
            })
        
        image_div = response.css('div#gallery-pdp-view')
        image = image_div.css('img').attrib['src']
        name = response.css('h1.split-product-title::text').get()
        name = name.strip()
        price_div = response.css('div#variant_price_display')
        price_get = price_div.css('span.mb-3::text').get()
        price_strip = price_get.strip()
        price_txt = price_strip.replace('$','')
        price = float(price_txt)
        description_div = response.css('div.product-description__content')
        description = description_div.css('p::text').get()

        review_div = response.css('div.okeReviews-reviewsSummary-starRating')
        review_score_text = review_div.css('span.okeReviews-a11yText::text').get()
        review_score = 0
        if review_score_text is not None:
            txt_split = review_score_text.split()
            review_score = float(txt_split[1])

        review_num_div = response.css('div.okeReviews-reviewsSummary-ratingCount')
        review_num_text = review_num_div.css('span.okeReviews-a11yText::text').get()
        review_number = 0
        if review_num_text is not None:
            txt_split = review_num_text.split()
            review_number = float(txt_split[2])

        yield{
            'image': 'https:' + image,
            'name': name,
            'price': price,
            'description': description,
            'categories': categories,
            'review_score': review_score,
            'review_number': review_number
        }






