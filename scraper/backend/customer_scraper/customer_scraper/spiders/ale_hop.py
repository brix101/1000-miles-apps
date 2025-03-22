import scrapy

website = "https://www.ale-hop.org/es/"
currency_sym = "€"

custom_headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
}


class AleHopSpider(scrapy.Spider):
    name = "ale_hop"
    allowed_domains = ["www.ale-hop.org"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }
    USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"  # copy user-agent from browser

    # Override the default request headers:
    DEFAULT_REQUEST_HEADERS = {
        "Accept": "*/*",  # copy this info from browser
        "Accept-Language": "en-US,en;q=0.9",  # copy this info from browser
    }

    def start_requests(self):
        yield scrapy.Request(website, callback=self.start_scraping)

    def start_scraping(self, response):
        nav_items = response.css(
            "li.cursor-pointer.megamenu__sublist-1st a.nav-level-1"
        )

        for nav in nav_items:
            nav_link = nav.attrib["href"]
            yield scrapy.Request(
                nav_link,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
                headers=custom_headers,
            )

    def parse_item(self, response):
        current_url = response.url
        container = response.css("div.products.wrapper.mode-grid.products-grid")
        products = container.css(
            "form.item.product.product-item, div.item.product.product-item"
        )

        has_product = len(products) > 1

        for product in products:
            product_name = product.css("span.product-card-title::text").get()
            product_name = product_name.strip() if product_name else ""
            product_link = product.css(
                "a.relative.product.photo.product-item-photo.block::attr(href)"
            ).get()
            product_price = product.css("span.price::text").get()
            product_price = (
                product_price.strip().replace(",", ".").replace(currency_sym, "")
                if product_price
                else "0.00"
            )

            data = {
                "name": product_name,
                "price": float(product_price),
            }
            yield scrapy.Request(
                product_link,
                callback=self.parse_product,
                meta={"data": data},
                headers=custom_headers,
            )

        print(has_product, "+++++++++++++", len(products), current_url)
        if "?p=" not in current_url:
            current_url = current_url + "?p=2"
        else:
            next_page_number = int(current_url.split("?p=")[-1]) + 1
            current_url = current_url.split("?p=")[0]
            current_url = current_url + f"?p={next_page_number}"

        if has_product:
            yield scrapy.Request(
                current_url,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
                headers=custom_headers,
            )

    def parse_product(self, response):
        categories = []
        li_elements = response.css(
            "nav.breadcrumbs ol.items.list-reset.flex.flex-wrap li"
        )
        categories = [
            {
                "name": li.css("a span::text").get().strip()
                if li.css("a span::text").get()
                else li.css("a::text").get().strip(),
                "level": int(li.xpath('meta[@itemprop="position"]/@content').get()) - 1,
            }
            for li in li_elements
            if "home" not in li.xpath("@class").get()
            and "product" not in li.xpath("@class").get()
        ]
        for item in categories:
            item["level"] -= 1

        div_element = response.css("div.product.attribute.prose div.value")

        # Extract the text from all the <p> elements within the <div> element
        paragraphs = div_element.css("p::text").getall()

        # Join the extracted paragraphs to get the complete text
        text_content = "\n".join(paragraphs).strip() if paragraphs else ""
        text_content = text_content.split("Diseño:")[0] if text_content else ""

        yield {
            **response.meta.get("data"),
            "categories": categories,
            "description": text_content,
        }
