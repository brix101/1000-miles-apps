import scrapy

website = "https://www.widdop.co.uk"
currency_sym = "€"
nested_url = "location=categories"


class WiddopSpider(scrapy.Spider):
    name = "widdop"
    allowed_domains = ["www.widdop.co.uk"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request(website, callback=self.start_scraping)

    def start_scraping(self, response):
        nav_items = response.css(
            "a[data-toggle='menu-dropdown'], a.dropdown-toggle.nav-dropdown__item-link, a.nav-dropdown__item-link"
        )
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
        products = response.css("div.product-list__grid__product")

        for product in products:
            product_link = product.css("div.product-summary__image a::attr(href)").get()
            image = product.css("div.responsive-image img::attr(src)").get()
            name = product.css("div.product-summary__name a span::text").get()

            data = {
                "name": name,
                "image": self.url_parse(image),
            }
            product_link = self.url_parse(product_link)
            yield scrapy.Request(
                product_link,
                callback=self.parse_product,
                meta={"data": data},
            )

        ########################################################################
        # For pagination
        next_page_link = response.css(
            "li[data-next-page] a::attr(href)"
        ).extract_first()

        if next_page_link:
            yield scrapy.Request(
                self.url_parse(next_page_link),
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )

        ########################################################################
        # FOr nested categories
        sub_categories = response.css("div.category-summary__name a")
        has_sub_cat = len(sub_categories) > 0

        for sub_cat in sub_categories:
            nav_link = sub_cat.attrib["href"]
            yield scrapy.Request(
                self.url_parse(nav_link),
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )

        print(
            has_sub_cat,
            "000000000000000000",
            bool(next_page_link),
            len(products),
            current_url,
        )

    def parse_product(self, response):
        a_tags = response.css("ol.breadcrumb-nav li a::text").getall()
        excluded_texts = a_tags[2:]
        categories = [
            {"name": text.strip(), "level": idx}
            for idx, text in enumerate(excluded_texts)
        ]
        description = response.css("div.description::text").get()

        yield {
            **response.meta.get("data"),
            "categories": categories,
            "description": description,
            "price": 0,
        }

    def url_parse(self, nav_link):
        if nav_link and website not in nav_link:
            nav_link = website + nav_link
        return nav_link
