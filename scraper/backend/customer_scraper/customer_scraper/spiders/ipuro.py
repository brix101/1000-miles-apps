import scrapy


class IpuroSpider(scrapy.Spider):
    name = "ipuro"
    allowed_domains = ["ipuro.com"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request('https://www.ipuro.com/', 
                             callback=self.parse_category,
                             meta={
                                 'deltafetch_enabled': False
                             })
        
    
    def parse_category(self, response):
        collapsibles = response.css('div.Collapsible__Inner')
        collapsibles.pop()
        urls = []
        for coll in collapsibles:
            lis = coll.css('li.Linklist__Item')
            for li in lis:
                url = li.css('a').attrib['href']
                url = 'https://www.ipuro.com' + url
                urls.append(url)
        
        for url in urls:
            yield scrapy.Request(url,
                                 callback=self.parse_item,
                                 meta={
                                     'deltafetch_enabled': False
                                 })
            
    def parse_item(self, response):
        products = response.css('div.ProductItem')
        category = response.css('h1.SectionHeader__Heading.Heading.u-h1::text').get()
        categories = [{
            'name': category,
            'level':0
        }]
        for prod in products:
            image = prod.css('img.ProductItem__Image').attrib['data-src']
            image = 'https:' + image
            image_url = image.replace("{width}", "1200")
            link = prod.css('a.ProductItem__ImageWrapper').attrib['href']
            link = 'https://www.ipuro.com' + link
            data = {
                'categories': categories,
                'image': image_url
            }
            yield scrapy.Request(link,
                                 callback=self.parse_product,
                                 meta={
                                     'data': data
                                 })
            
    def parse_product(self, response):
        data = response.meta.get('data')
        name = response.css('h1.ProductMeta__Title.Heading.u-h2::text').get()
        price= response.css('span.ProductMeta__Price.Price.Text--subdued.u-h4::text').get()
        price = price.strip().replace('€', '').strip().replace(".", "").replace(",",".") if price!=None else 0
        price = float(price)
        desc = response.css('div.ProductMeta__Description')
        descrips = desc.css('p::text').getall()
        description = ""
        for de in descrips:
            description += de

        yield{
            **data,
            'name': name,
            'price': price,
            'description': description
        }
        
