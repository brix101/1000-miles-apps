import scrapy

website = "https://www.crownconcepts.com.au/store/"
currency_sym = "$"


class CrownConceptSpider(scrapy.Spider):
    name = "crownconcepts"
    allowed_domains = ["www.crownconcepts.com.au"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request(website, callback=self.start_scraping)

    def start_scraping(self, response):
        nav_items = response.css("li.level0.custom-item a")

        navigation_urls = []
        for nav in nav_items:
            nav_link = nav.attrib["href"]
            if nav_link and website not in nav_link:
                nav_link = website + nav_link

            if "/index.asp" not in nav_link and nav_link not in navigation_urls:
                navigation_urls.append(nav_link)

        for url in navigation_urls:
            yield scrapy.Request(
                url,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )

    def parse_item(self, response):
        products = response.css("div.cell-wrap.list-items.item-shadow")
        categories = response.css("div.container.page h1::text").get()

        for product in products:
            image = product.css("a img.main::attr(src)").get()
            if image and website not in image:
                image = website + image

            product_title = product.css("h4.listitems-title")
            product_title_a = product_title.css("a")
            product_href = product_title_a.attrib.get("href", "")
            name = product_title_a.css("::text").get().strip()

            data = {
                "name": name,
                "image": image,
                "categories": [{"name": categories, "level": 0}],
            }

            if website not in product_href:
                product_href = website + product_href

            yield scrapy.Request(
                product_href,
                callback=self.parse_product,
                meta={"data": data},
            )

        next_page_button = response.css(
            'input[type="BUTTON"][value=">"][onclick^="document.location.href="]::attr(onclick)'
        ).get()

        if next_page_button:
            next_page = (
                next_page_button.replace("document.location.href='", "")
                .replace("&amp;", "&")
                .rstrip("'")
            )
            if website not in next_page:
                next_page = website + next_page

            yield scrapy.Request(
                next_page,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )

    def parse_product(self, response):
        price_text = response.css("p.viewItem-price::text").get()
        price = (
            price_text.strip().replace(currency_sym, "").replace(",", "")
            if price_text
            else 0
        )

        description = ""
        description_element = response.css("div.col-sm-12.col-md-6.col-lg-6")
        if description_element:
            h1_element = description_element.xpath("//h1")
            if h1_element:
                description_element = h1_element.xpath("following-sibling::p").get()
                if description_element:
                    description = (
                        scrapy.Selector(text=description_element)
                        .xpath("//p//text()")
                        .get()
                        .strip()
                    )

        yield {
            **response.meta.get("data"),
            "price": float(price),
            "description": description,
        }
