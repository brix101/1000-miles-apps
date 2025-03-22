import scrapy
import re

website = "https://kikkerland.com"
currency_sym = "$"


class KikkerLandSpider(scrapy.Spider):
    name = "kikkerland"
    allowed_domains = ["kikkerland.com"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request(website, callback=self.start_scraping)

    def start_scraping(self, response):
        nav_items = response.css("li.navmenu-item a")

        navigation_urls = []
        for nav in nav_items:
            nav_link = nav.attrib["href"]
            if nav_link and website not in nav_link and "http" not in nav_link:
                nav_link = website + nav_link

            if (
                nav_link != website + "/"
                and "https" in nav_link
                and nav_link not in navigation_urls
            ):
                navigation_urls.append(nav_link)

        for url in navigation_urls:
            yield scrapy.Request(
                url,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )

    def parse_item(self, response):
        products = response.css("div.productitem")

        for product in products:
            product_title = product.css("h2.productitem--title")
            product_title_a = product_title.css("a")
            product_href = product_title_a.attrib.get("href", "")
            name = product_title_a.css("::text").get().strip()
            if website not in product_href:
                product_href = website + product_href

            data = {
                "name": name,
            }

            yield scrapy.Request(
                product_href,
                callback=self.parse_product,
                meta={"data": data},
            )

        link = response.css("li.pagination--next a.pagination--item::attr(href)").get()
        if link:
            link = link.replace(" ", "").replace("\n", "")
        if link and website not in link:
            link = website + link
            yield scrapy.Request(
                link,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )

    def parse_product(self, response):
        categories_nav = response.css("nav.breadcrumbs-container")

        categories = []

        for index, category in enumerate(categories_nav, start=0):
            a_tag = category.css('a[href]:not([href="/"])')
            if a_tag:
                a_tag_text = a_tag.css("::text").get().strip()

                categories.append({"name": a_tag_text, "level": index})
        data_image = response.css(
            "div.product-galley--image-background::attr(data-image)"
        ).get()
        if "https:" not in data_image:
            data_image = "https:" + data_image

        price_text = response.css("span.money::text").get()
        price = (
            price_text.strip().replace(currency_sym, "").replace(",", "")
            if price_text
            else 0
        )

        description = response.css("div.og_description ::text").getall()
        description_text = " ".join(description).strip()
        filtered_description = re.sub(
            "<!--\ntd.*?\n-->", "", description_text
        )  # Remove content inside <!-- -->

        yield {
            **response.meta.get("data"),
            "price": float(price),
            "categories": categories,
            "image": data_image,
            "description": filtered_description,
        }
