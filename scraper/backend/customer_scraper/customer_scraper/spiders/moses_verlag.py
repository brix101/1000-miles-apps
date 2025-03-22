import scrapy

website = "https://www.moses-verlag.de"


class MosesSpider(scrapy.Spider):
    name = "moses"
    allowed_domains = ["www.moses-verlag.de"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request(website, callback=self.start_scraping)

    def start_scraping(self, response):
        nav_items = response.css("a.nav-link.main-navigation-link")
        navigation_urls = []
        for nav in nav_items:
            nav_link = nav.attrib["href"]
            nav_link = self.url_parse(nav_link)
            if "#" not in nav_link and nav_link not in navigation_urls:
                navigation_urls.append(nav_link)
        for url in navigation_urls:
            yield scrapy.Request(
                url,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )

    def parse_item(self, response):
        current_url = response.url
        products = response.css("div.card.product-box.box-standard")

        for product in products:
            price = 0
            name = product.css("h3.product-name a::text").get().strip()
            product_link = product.css("h3.product-name a::attr(href)").get()
            image = (
                product.css("img.product-image.is-standard::attr(src)").get().strip()
            )
            price_element = product.css("span.product-price::text").get()

            if price_element:
                price_element = price_element.strip().replace("\xa0", "")
                price_element = price_element.replace(",", ".")
                currency_symbol = "€"
                asterisk_symbol = "*"
                price_element = price_element.replace(currency_symbol, "").replace(
                    asterisk_symbol, ""
                )
                price = float(price_element)

            data = {"name": name, "image": self.url_parse(image), "price": price}

            yield scrapy.Request(
                product_link,
                callback=self.parse_product,
                meta={"data": data},
            )

        next_li = response.css("li.page-item.page-next:not(.disabled)")

        if next_li:
            next_input = next_li.css("input#p-next")

            next_value = next_input.attrib.get("value")

            if "?order=topseller&p=" in current_url:
                base_url = current_url.split("?order=topseller&p=")[0]
                current_url = base_url + "?order=topseller&p=" + next_value
            else:
                current_url = current_url + "?order=topseller&p=" + next_value

            yield scrapy.Request(
                current_url,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )

    def parse_product(self, response):
        categories = []
        li_elements = response.css("ol.breadcrumb li")[1:]

        for idx, li in enumerate(li_elements):
            name = li.css("a span.breadcrumb-title::text").get()
            level = idx

            category = {"name": name, "level": level}
            categories.append(category)

        descriptions = response.css(
            "div.product-detail-description-text::text"
        ).getall()
        cleaned_descriptions = [desc.strip() for desc in descriptions if desc.strip()]
        description = " ".join(cleaned_descriptions)
        try:
            description = description.split('.')
            description = description[0]
        except Exception as e:
            pass

        yield {
            **response.meta.get("data"),
            "categories": categories,
            "description": description,
        }

    def url_parse(self, nav_link):
        if nav_link and website not in nav_link:
            nav_link = website + nav_link
        return nav_link
