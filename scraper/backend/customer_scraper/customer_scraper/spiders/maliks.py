import scrapy

website = "https://www.maliks.com"
currency_sym = "$"


class MaliksSpider(scrapy.Spider):
    name = "maliks"
    allowed_domains = ["www.maliks.com"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request(website, callback=self.start_scraping)

    def start_scraping(self, response):
        nav_items = response.css("li.mega-menu-categories")

        for nav in nav_items:
            link = nav.css("a").attrib["href"]
            yield scrapy.Request(
                website + link,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )

    def parse_item(self, response):
        products = response.css("div.product-item")
        for product in products:
            product_title = product.css("h2.product-title")
            product_title_a = product_title.css("a")
            href = product_title_a.attrib.get("href", "")
            name = product_title_a.css("::text").get().strip()
            price = product.css("span.price.actual-price::text").get()

            if price and currency_sym in price:
                data = {
                    "name": name,
                    "price": float(price.replace("$", "").replace(",", "")),
                }

                yield scrapy.Request(
                    website + href,
                    callback=self.parse_product,
                    meta={"data": data},
                )

        next_page = response.css("li.next-page a::attr(href)").extract_first()
        if next_page is not None:
            yield scrapy.Request(
                next_page,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )

    def parse_product(self, response):
        image_url = response.css("img.cloudzoom").attrib["src"]

        categories = []
        description_div = response.css("div.short-description::text").extract_first()
        description = description_div.strip() if description_div else ""
        categories_nav = response.css('li[itemprop="itemListElement"]')
        for index, category in enumerate(categories_nav, start=0):
            if not category.css("strong.current-item"):
                item_name = (
                    category.css('span[itemprop="name"]::text')
                    .extract_first(default="")
                    .strip()
                )
                categories.append({"name": item_name, "level": index})

        yield {
            **response.meta.get("data"),
            "categories": categories,
            "image": image_url,
            "description": description,
        }
