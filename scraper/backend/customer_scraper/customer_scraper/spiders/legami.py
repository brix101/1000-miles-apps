import scrapy
import re

website = "https://www.legami.com"
currency_sym = "€"

custom_headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
}


class LegamiSpider(scrapy.Spider):
    name = "legami"
    allowed_domains = ["www.legami.com"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request(website, callback=self.start_scraping)

    def start_scraping(self, response):
        nav_items = response.css("li.nav-item.dropdown")

        for nav in nav_items:
            nav_link = nav.css("a::attr(href)").get()
            if website not in nav_link:
                nav_link = website + nav_link

            yield scrapy.Request(
                nav_link,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
                headers=custom_headers,
            )

    def parse_item(self, response):
        current_url = response.url

        if "Search-UpdateGrid?cgid=" not in current_url:
            count_str = response.css("span.search-results-total-ingrid::text").get()
            count = [int(match) for match in re.findall(r"\d+", count_str)][0]

            last_part = current_url.split("/")[-1]
            category_id = last_part.replace(".html", "").replace("-", "_")
            category_id = (
                category_id
                if category_id != "viaggi_tempo_libero"
                else "viaggi_e_tempo_libero"
            )

            new_url = f"{website}/on/demandware.store/Sites-legamiIT-Site/it_IT/Search-UpdateGrid?cgid={category_id}&sz={count}"
            yield scrapy.Request(
                new_url,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
                headers=custom_headers,
            )

        else:
            products = response.css("div.col-6.col-sm-6.col-md-6.col-lg-4.col-xl-3")

            for product in products:
                name = product.css("div.pdp-link a::text").get()
                image = product.css("img.tile-image::attr(src)").get()
                price = product.css("span.value::attr(content)").get()
                price = price if price else 0
                product_link = product.css(
                    "div.image-container.position-relative a::attr(href)"
                ).get()

                if website not in product_link:
                    product_link = website + product_link

                image = image.replace("sw=400", "sw=800").replace("sh=400", "sh=800")

                data = {
                    "name": name,
                    "image": image,
                    "price": float(price),
                }

                yield scrapy.Request(
                    product_link,
                    callback=self.parse_product,
                    meta={"data": data},
                    headers=custom_headers,
                )

    def parse_product(self, response):
        breadcrumb_items = response.css("ol.breadcrumb li.breadcrumb-item")
        categories = []

        for level, item in enumerate(breadcrumb_items):
            name = item.css("a::text").get().strip()
            categories.append({"name": name, "level": level})

        text_contents = response.css(
            "div.value.content.product-description::text"
        ).getall()
        description = "\n".join(text.strip() for text in text_contents)

        yield {
            **response.meta.get("data"),
            "categories": categories,
            "description": description,
        }
