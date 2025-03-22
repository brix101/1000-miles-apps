import scrapy


urls = [
    'https://www.therange.co.uk/furniture/new-in-furniture',
    'https://www.therange.co.uk/storage/new-in-storage',
    'https://www.therange.co.uk/home-soft-furnishings/new-in-home-furnishing',
    'https://www.therange.co.uk/lighting/new-in-lighting',
    'https://www.therange.co.uk/cooking-and-dining/new-in-cooking-and-dining',
    'https://www.therange.co.uk/household/new-in-household',
    'https://www.therange.co.uk/outdoor-living/new-in-outdoor-living',
    'https://www.therange.co.uk/garden/new-in-garden',
    'https://www.therange.co.uk/household/new-in-household',
    'https://www.therange.co.uk/decorating/new-in-decorating',
    'https://www.therange.co.uk/diy/new-in-diy-and-decorating',
    'https://www.therange.co.uk/pets/new-in-pets',
    'https://www.therange.co.uk/leisure/new-in-leisure',
    'https://www.therange.co.uk/stationery/new-in-stationery',
    'https://www.therange.co.uk/arts-and-crafts/new-in-arts-and-crafts/',
    'https://www.therange.co.uk/appliances-and-technology/new-in-technology-and-appliances/',
    'https://www.therange.co.uk/bathroom/new-in-bathroom/',
    'https://www.therange.co.uk/clothing-and-wellbeing/clothing-and-accessories/clothing-new-in',
    'https://www.therange.co.uk/health-and-beauty/new-in-health-and-beauty',
    'https://www.therange.co.uk/baby-kids-and-toys/toys/new-in-toys/'  
]

class TheRangeSpider(scrapy.Spider):
    name = "the_range"
    allowed_domains = ["therange.co.uk"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": True,
    }

    def start_requests(self):
        yield scrapy.Request(
            'https://www.therange.co.uk/new-in/',
            callback=self.pagination,
            meta={
                "zyte_api_automap": {
                    "browserHtml": True,
                },
                'link': 'https://www.therange.co.uk/new-in/'
            },
        )

    def start_scraping(self, response):
        categories = response.css('a.col-xs-12.col-sm-12.col-md-12.col-lg-12')
        for category in categories:
            link = category.css('a').attrib['href']
            class_ = category.css('a').attrib['class']
            if class_ == 'col-xs-12 col-sm-12 col-md-12 col-lg-12':
                link = 'https://www.therange.co.uk' + link
                yield scrapy.Request(
                    link, 
                    callback=self.pagination, 
                    meta={ 
                        "zyte_api_automap": {
                            "browserHtml": True,
                        },
                        'link':link,
                        'deltafetch_enabled': False
                    }
                )
        
    def pagination(self, response):
        link = response.meta.get('link')
        counts = response.css('span.pl_showing_count::text').get()
        if counts!=None:
            link = link + '#sort=relevance&page=1&lpp=%s' % counts.strip()
            yield scrapy.Request(link, 
                                 callback=self.parse_item, 
                                 dont_filter=True,
                                 meta={
                                    "zyte_api_automap": {
                                        "browserHtml": True,
                                        "actions": [
                                            {
                                                "action": "scrollBottom",
                                            },
                                        ],
                                    },
                                    'deltafetch_enabled': False
                                })
    
    def parse_item(self, response):
        products = response.css('div.col-xs-3.js_listing')
        breadcrumb = response.css('ol.container.breadcrumb')
        lists =  breadcrumb.css('li')
        categories = []
        index = 0
        for i in range(1, len(lists)):
            category = lists[i].css('a::text').get() if lists[i].css('a::text').get()!=None else lists[i].css('h1::text').get()
            categories.append({ 'name': category.strip().lower() if category !=None else '', 'level': index })
            index += 1

        for product in products:
            image = product.css('img').attrib['src']
            name = product.css('img').attrib['alt']
            price = product.css('div.col-xs-12.price::text').get()
            price = price.strip().replace('£', '') if price!=None else 0
            if 'From' in price:
                price = price.replace('From', '')
                price = price.strip()
            review_score = 0
            review_number = 0
            review_div = product.css('div.review')
            review_spans = review_div.css('span')
            if len(review_spans)>1:
                rs = review_spans[0].css('span::text').get()
                if rs is not None:
                    rs_ = rs.replace('%', '')
                    rs_strip = rs_.strip()
                    review_score = float(rs_strip)
                rn = review_spans[1].css('span::text').get()
                if rn is not None:
                    rn_ = rn.replace('reviews', '')
                    rn_strip = rn_.strip()
                    review_number = float(rn_strip)

            yield{
                'image': image.strip(),
                'name': name.strip(),
                'price': float(price),
                'categories': categories,
                'description': '',
                'review_score': review_score,
                'review_number': review_number,
            }

        




            
        

        
