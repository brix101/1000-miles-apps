import scrapy

class LondonDrugsSpider(scrapy.Spider):
    name = "london_drugs"
    allowed_domains = ["londondrugs.com"]

    urls = []

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": True,
        'DOWNLOAD_DELAY': 1
    }

    def start_requests(self):
        yield scrapy.Request('https://www.londondrugs.com/whats-new/', 
                             callback=self.parse_new,
                             meta={
                                 'solve_captcha': True,
                                 'dont_redirect': True
                             })

    def parse_category(self, response):
        categoriesDiv = response.css('div.subCatLinks')
        aTags = categoriesDiv.css('a')
        for a in aTags:
            link = a.css('a').attrib['href']
            print(link)
            yield scrapy.Request(link,
                                 callback=self.parse_sub_category,
                                 dont_filter=True,
                                 meta={
                                     'solve_captcha': True,
                                     'deltafetch_enabled': False,
                                     'dont_redirect': True
                                 })
    
    def parse_sub_category(self, response):
        categoriesA = response.css('a.igItem')
        for category in categoriesA:
            try:
                urlt = category.css('a').attrib['href']
                url = 'https://www.londondrugs.com'+ urlt if 'https://www.londondrugs.com' not in urlt else urlt
                print('ccccccccccccccccccccccccccccccccccccccccccccccccccccccccc')
                print(url)
                yield scrapy.Request(url,
                                    callback=self.parse_item,
                                    dont_filter=True,
                                    meta={
                                        "zyte_api": {
                                            "browserHtml": True,
                                            "actions": [
                                                {
                                                    "action": "scrollBottom",
                                                },
                                            ],
                                        },
                                        'solve_captcha': True,
                                        'deltafetch_enabled': False,
                                        'dont_redirect': True
                                    })
            except Exception as e:
                continue
            
        # if len(categoriesA) < 1:
        #     categoriesDiv = response.css('div.shopByIcons')
        #     categoriesA = categoriesDiv.css('a')
        #     print('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
        #     print(categoriesDiv.get())
        #     for a in categoriesA:
        #         link = a.css('a').attrib['href']
        #         url = 'https://www.londondrugs.com'+ link if 'https://www.londondrugs.com' not in link else link
        #         print(url)
        #         yield scrapy.Request(url,
        #                              callback=self.parse_item,
        #                               meta={
        #                                 "zyte_api": {
        #                                     "browserHtml": True,
        #                                     "actions": [
        #                                         {
        #                                             "action": "scrollBottom",
        #                                         },
        #                                     ],
        #                                 },
        #                                 'deltafetch_enabled': False
        #                             })
    
    def parse_new(self, response):
        print('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn')
        boxes = response.css('div.ldo_boxes')
        if len(boxes) > 0:
            box = boxes[0]
            divs = box.css('div.ldo_banners')
            for div in divs:
                url = div.css('a').attrib['href']
                print(url)
                yield scrapy.Request(url,
                                     callback=self.parse_inside_new,
                                     dont_filter=True,
                                     meta={
                                         "zyte_api": {
                                             "browserHtml": True,
                                             "actions": [
                                                {
                                                    "action": "scrollBottom",
                                                },
                                             ],
                                         },
                                         'solve_captcha': True,
                                         'deltafetch_enabled': False,
                                         'dont_redirect': True
                                     })
    
    def parse_inside_new(self, response):
        print('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
        products = response.css('li.product-tile.product-tile-one')
        if len(products) > 0:
            for product in products:
                url = product.css('a.product-image-link').attrib['href']
                yield scrapy.Request(url,
                                     callback=self.parse_product,
                                     dont_filter=True,
                                     meta={
                                         "zyte_api": {
                                           "browserHtml": True
                                         },
                                         'solve_captcha': True,
                                         'deltafetch_enabled': False,
                                         'dont_redirect': True
                                     })
        else:
            categoriesDiv = response.css('ul.breadcrumbs')
            categoriesLi = categoriesDiv.css('a')
            categories = []
            for index, li in enumerate(categoriesLi):
                count = len(categoriesLi)-1
                if index > 0 and index < count:
                    text = li.css('a::text').get()
                    text = text.strip()
                    if text != '... /':
                        categories.append({
                            'name':text,
                            'level': index
                        })
                
            image = response.css('img.primary-image').attrib['src']
            image = 'https://www.londondrugs.com' + image

            name = response.css('h1.ld-sg-heading.ld-sg-heading--title.ld-sg-heading--no-margin.pdp-heading::text').get()
            name = name.strip()

            try:
                priceDiv = response.css('h3.price-sales.markdown-price-false.ld-sg-heading::text').get()
                priceTemp = priceDiv.replace('$', '')
                priceStrip = priceTemp.strip()
                price = float(priceStrip)

            except Exception as e:
                priceDiv = response.css('h3.price-sales.markdown-price-true.ld-sg-heading::text').get()
                priceTemp = priceDiv.replace('$', '')
                priceStrip = priceTemp.strip()
                price = float(priceStrip)

            descriptionDiv = response.css('div.ld-sg-tabs__item-content.js-tabs-item_content.m-open')
            des = descriptionDiv.css('div')
            description = ''
            if len(des) > 0:
                description = des[1].css('div::text').get()
                description = description.strip() if description is not None else ''

            review_stars = response.css('div.bv-primarySummary-rating-container')
            scoreSpan = review_stars.css('span.bv-off-screen::text').get()
            score = 0
            try:
                if scoreSpan is not None:
                    scoreSplit = scoreSpan.split(" ")
                    score_text = scoreSplit[0]
                    score = float(score_text)
            except Exception as e:
                score = 0
            
            total = 0
            try:
                totalSpan = review_stars.css('span.reviewCount::text').get()
                if totalSpan is not None:
                    totalStrip = totalSpan.strip()
                    total = float(totalStrip)
            except Exception as e:
                total = 0

            yield{
                'image': image,
                'name': name,
                'price': price,
                'categories': categories,
                'review_score': score,
                'review_number': total,
                'description': description
            }


    def parse_item(self, response):
        categoriesDiv = response.css('ul.breadcrumbs')
        categoriesLi = categoriesDiv.css('a')
        categories = []
        for index, li in enumerate(categoriesLi):
            if index>0:
                text = li.css('a::text').get()
                text = text.strip()
                categories.append({
                    'name':text,
                    'level': index
                })

        products = response.css('li.product-tile.product-tile-one')
        for product in products:
            name = product.css('h3.ld-sg-heading--product-tile::text').get()
            name = name.strip()

            image = product.css('img.product-image.lozad').attrib['data-src']

            priceLi = product.css('li.price')
            priceText = priceLi.css('p::text').get()
            priceDecimal = priceLi.css('sup::text').get()
            priceTextStrip = priceText.strip() if priceText is not None else ''
            priceT = priceTextStrip.replace('$','')
            priceDecimalStrip = priceDecimal.strip() if priceDecimal is not None else ''
            price = priceT + priceDecimalStrip
            try:
                price = float(price)
            except Exception as e:
                price = 0

            review_stars = product.css('div.rating-stars')
            scoreSpan = review_stars.css('span.bv-off-screen::text').get()
            score = 0
            try:
                if scoreSpan is not None:
                    scoreSplit = scoreSpan.split(" ")
                    score_text = scoreSplit[0]
                    score = float(score_text)
            except Exception as e:
                score = 0
            
            total = 0
            try:
                totalSpan = review_stars.css('span.bv-rating-label::text').get()
                if totalSpan is not None:
                    totalStrip = totalSpan.strip()
                    totalTemp = totalStrip.replace('(', '')
                    totalTemp = totalTemp.replace(')','')
                    total = float(totalTemp)
            except Exception as e:
                total = 0

            yield{
                'image': image,
                'name': name,
                'price': price,
                'categories': categories,
                'review_score': score,
                'review_number': total,
                'description': ''
            }

    def parse_product(self, response):
        categoriesDiv = response.css('ul.breadcrumbs')
        categoriesLi = categoriesDiv.css('a')
        categories = []
        for index, li in enumerate(categoriesLi):
            count = len(categoriesLi)-1
            if index > 0 and index < count:
                text = li.css('a::text').get()
                text = text.strip()
                if text != '... /':
                    categories.append({
                        'name':text,
                        'level': index
                    })
        
        image = response.css('img.primary-image').attrib['src']
        image = 'https://www.londondrugs.com' + image

        name = response.css('h1.ld-sg-heading.ld-sg-heading--title.ld-sg-heading--no-margin.pdp-heading::text').get()
        name = name.strip()

        try:
            priceDiv = response.css('h3.price-sales.markdown-price-false.ld-sg-heading::text').get()
            priceTemp = priceDiv.replace('$', '')
            priceStrip = priceTemp.strip()
            price = float(priceStrip)

        except Exception as e:
            priceDiv = response.css('h3.price-sales.markdown-price-true.ld-sg-heading::text').get()
            priceTemp = priceDiv.replace('$', '')
            priceStrip = priceTemp.strip()
            price = float(priceStrip)

        descriptionDiv = response.css('div.ld-sg-tabs__item-content.js-tabs-item_content.m-open')
        des = descriptionDiv.css('div')
        description = ''
        if len(des) > 0:
            description = des[1].css('div::text').get()
            description = description.strip() if description is not None else ''

        review_stars = response.css('div.bv-primarySummary-rating-container')
        scoreSpan = review_stars.css('span.bv-off-screen::text').get()
        score = 0
        try:
            if scoreSpan is not None:
                scoreSplit = scoreSpan.split(" ")
                score_text = scoreSplit[0]
                score = float(score_text)
        except Exception as e:
            score = 0
        
        total = 0
        try:
            totalSpan = review_stars.css('span.reviewCount::text').get()
            if totalSpan is not None:
                totalStrip = totalSpan.strip()
                total = float(totalStrip)
        except Exception as e:
            total = 0

        yield{
            'image': image,
            'name': name,
            'price': price,
            'categories': categories,
            'review_score': score,
            'review_number': total,
            'description': description
        }