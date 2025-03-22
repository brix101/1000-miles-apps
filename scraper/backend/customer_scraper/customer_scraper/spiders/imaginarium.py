import scrapy
import requests
import json

class Imaginarium(scrapy.Spider):
    name = 'imaginarium'
    allowed_domains= ['loja.imaginarium.com.br']

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }


    def start_requests(self):
        yield scrapy.Request('https://loja.imaginarium.com.br/',
                             callback=self.parse_navigation
                             )
    
    def parse_navigation(self, response):
        scripts = response.css('script')
        last = ''
        for sc in scripts:
            temp = sc.get()
            if "store.home" in temp:
                last = temp
        
        last = last.replace('<script>', '')
        last = last.replace('</script>', '')
        last = json.loads(last)
        urls = []
        for item in last:
            if 'store.home/$before_header.full/header-layout.desktop/header-row#3-desktop/menu#menu-desktop/menu-item' in item:
                props = last[item]['props']
                if 'itemProps' in props:
                    link = props['itemProps']['href']
                    title = props['itemProps']['tagTitle']
                    if '?' not in link and len(link)>0 and 'presente-mistico-colecao-planetarium' not in link:
                        urls.append({
                            'name': title,
                            'link': link
                        })
                if 'items' in props:
                    links = props['items']
                    for li in links:
                        link = li['itemProps']['href']
                        title = li['itemProps']['tagTitle']
                        if '?' not in link and len(link)>0 and 'presente-mistico-colecao-planetarium' not in link:
                            urls.append({
                            'name': title,
                            'link': link
                            })
        
        for ur in urls:
            ref = 'https://loja.imaginarium.com.br' + ur['link']
            yield scrapy.Request(ref,
                                 callback=self.parse_item,
                                 meta={
                                     'category': ur['name'],
                                     'page': 2,
                                     'url': ref,
                                     'deltafetch_enabled': False
                                 })
        
    
    def parse_item(self, response):
        category = response.meta.get('category')
        scripts = response.css('script')
        last = ''
        products = []
        for sc in scripts:
            temp = sc.get()
            if "@context" in temp:
                last = temp.replace('<script type="application/ld+json">', '')
                last = last.replace('</script>', '')
                last = json.loads(last)
                products = last['itemListElement']
                break
        headers = {'Accept': 'application/json', 'Access-Control-Allow-Origin':'*'}
        for product in products:
            yield_data = {}
            yield_data['name'] = product['item']['name']
            yield_data['price'] = 0
            yield_data['image'] = product['item']['image']
            yield_data['description'] = product['item']['description'].strip()
            yield_data['categories'] = [{
                'name':category,
                'level': 0
            }]
            # try:
            #     r = requests.get(f"https://imaginarium-br.mais.social/api/pdp/reviews/rating?ecommerceId=ium&productIds={product['item']['mpn']}&locale=ptBr", headers=headers)
            #     data = r.json()
            #     print(data)
                
            # except:
            #     continue

            link = product['item']['@id']
            yield scrapy.Request(link,
                                callback=self.parse_product,
                                meta={
                                    'data': yield_data
                                })
        

        page = response.meta.get('page')
        url = response.meta.get('url')
        next_page = response.css('div.vtex-button__label.flex.items-center.justify-center.h-100.ph5')
        if len(next_page) > 0 and next_page is not None:
            link = f"{url}?page={page}"
            yield scrapy.Request(link,
                                 callback=self.parse_item,
                                 meta={
                                     'category': category,
                                     'page': page+1,
                                     'url': url,
                                     'deltafetch_enabled': False
                                 })
    
    def parse_product(self, response):
        data = response.meta.get('data')
        yield data
