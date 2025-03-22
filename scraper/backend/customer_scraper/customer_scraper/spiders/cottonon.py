import scrapy
import requests

links = [
    "https://cottonon.com/AU/",
    "https://cottonon.com/AU/cottononbody/",
    "https://cottonon.com/AU/cottononkids/",
    "https://cottonon.com/AU/typo-home/",
    "https://cottonon.com/AU/factorie-home/",
    "https://cottonon.com/AU/supre-home/"
]

class CottonOnSpider(scrapy.Spider):
    name = "cotton_on"
    allowed_domains = ["cottonon.com"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        for link in links:
            yield scrapy.Request(link, callback=self.category_one_parse)


    def category_one_parse(self, response):
        headers = response.css('li.has-submenu.column.xlarge-6')
        categories_links = []
        for head in headers:
            large_popups = head.css('div.row.mega-menu-flyout-sub')
            if len(large_popups) > 0:
                a_tags = large_popups.css('a')
                for a in a_tags:
                    href = a.css('a').attrib['href']
                    categories_links.append(href)
                
            else:
                href = head.css('a').attrib['data-href']
                categories_links.append(href)
        
        for link in categories_links:
            yield scrapy.Request(link, 
                                 callback=self.parse_items,
                                 meta={
                                     'deltafetch_enabled': False
                                 })
    
    def parse_items(self, response):
        breadcrumbs = response.css('ul.breadcrumbs')
        categs = breadcrumbs[0].css('span::text').getall()
        categories = []
        for idx, cg in enumerate(categs):
            categories.append({
                'name': cg.lower(),
                'level': idx
            })
        
        products = response.css('div.product-tile')
        for product in products:
            try:
                image = product.css('img').attrib['src']
                href = product.css('a.name-link').attrib['href']
                yield scrapy.Request(href, 
                                    callback=self.parse_product, 
                                    meta={
                                        'categories': categories, 
                                        'image': image
                                    })

            except Exception as e:
                image = image = product.css('img').attrib['data-alternative']
                href = product.css('a.name-link').attrib['href']
                yield scrapy.Request(href, 
                                    callback=self.parse_product, 
                                    meta={
                                        'categories': categories, 
                                        'image': image
                                    })

        next_page = response.css('a.load-more-btn.button.primary.hollow')
        if len(next_page)>0 and next_page is not None:
            next_link = next_page.css('a').attrib['href']
            if next_link != response.url and 'pmax' not in next_link:
                yield response.follow(next_link, 
                                    callback=self.parse_items,
                                    meta={
                                        'deltafetch_enabled': False
                                    })


    def parse_product(self, response):
        categories = response.meta.get('categories')
        if len(categories) < 1:
            breadcrumbs = response.css('ul.breadcrumbs.row')
            lis = breadcrumbs.css('li')
            for index, li in enumerate(lis):
                name_categ = li.css('a::text').get()
                name_categ = name_categ.strip()
                categories.append({
                    "name": name_categ.lower(),
                    "level": index
                })

        image_url = response.meta.get('image')
        name = response.css('h1.product-name.name-above-price::text').get()
        name = name.strip() if name!=None else ''
        price_text = response.css('span.price-sales::text').get()
        price = price_text.strip() if price_text!=None else ''
        price = price.replace('$', '')
        desc_div = response.css('div#description-tab')
        description = desc_div.css('pre::text').get()

        product_id = response.css('div.bv-rating-summary').attrib['data-bv-product-id']
        headers = {'Accept': 'application/json'}
        r = requests.get(f"https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey=caVdVFPwoIgM0aZNRHGOU6fEFYKO0FqO5BSuRQCMLKy94&productid={product_id}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=en*,en_AU", headers=headers)
        reviews = r.json()

        num_reviews = reviews['reviewSummary']['numReviews']
        num_reviews = float(num_reviews) if num_reviews != None else 0
        score = reviews['reviewSummary']['primaryRating']['average']
        score = float(score) if score != None else 0

        yield{
            'image': image_url,
            'name': name,
            'price': float(price),
            'description': description,
            'categories': categories,
            'review_score': score,
            'review_number': num_reviews
        }
