import scrapy
import requests

website = "https://www.plaisio.gr"
currency_sym = "€"
image_src = "https://cdn.plaisio.gr/mms/Product-Images/PlaisioGr"
invalid_url = "catalog?location="


class PlaisioSpider(scrapy.Spider):
    name = "plaisio"
    allowed_domains = ["www.plaisio.gr"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request(website, callback=self.start_scraping)

    def start_scraping(self, response):
        nav_items = response.css("ul.level4 li a")
        navigation_urls = []
        for nav in nav_items:
            nav_link = nav.attrib["href"]
            if nav_link and website not in nav_link:
                nav_link = website + nav_link

            if nav_link not in navigation_urls and invalid_url not in navigation_urls:
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
        products = response.css("div.product")

        for product in products:
            product_link = product.css("div.image a::attr(href)").get()
            product_name = product.css(
                'div.product-title div[itemprop="name"]::text'
            ).get()
            price = product.css("div.price div.price ::text").get()
            price = price if price else 0

            if product_link and website not in product_link:
                product_link = website + product_link

            data = {
                "name": product_name,
                "price": float(price),
            }

            yield scrapy.Request(
                product_link,
                callback=self.parse_product,
                meta={"data": data},
            )

        next_button = response.css("li.next.arrow:not(.unavailable)")
        has_next = bool(next_button)

        print("++++++++++++++", has_next, len(products), current_url)
        if has_next:
            next_page = current_url.split("/")[-1]
            if "page" not in next_page:
                current_url = current_url + "/page-2"
            else:
                next_page_number = int(next_page.split("-")[-1]) + 1
                current_url = current_url.split("page-")[0]
                current_url = current_url + f"page-{next_page_number}"

            if invalid_url not in current_url:
                yield scrapy.Request(
                    current_url,
                    callback=self.parse_item,
                    dont_filter=True,
                    meta={"deltafetch_enabled": False},
                )

    def parse_product(self, response):
        unique_names = set()
        categories = []
        breadcrumbs_div = response.xpath("//div[contains(@class, 'breadcrumbs')]")
        breadcrumbs = breadcrumbs_div.xpath(
            ".//li[not(a/@href='/') and not(a/@href='#')]"
        )

        for index, breadcrumb in enumerate(breadcrumbs, start=0):
            name = breadcrumb.xpath(".//span/text()").get().strip()
            if name not in unique_names:
                unique_names.add(name)
                categories.append({"name": name, "level": index})

        description_p = response.xpath(
            "//div[contains(@class, 'pdp-characteristics__middle')]/p"
        )

        description_text = description_p.xpath("string()").get().strip()
        product_id = response.url.split("/")[-1]
        product_sku = product_id.split("_")[-1].lstrip("_")

        r = requests.get(
            f"https://widgets.reevoo.com/api-feefo/api/10/reviews/summary/product?locale=el_GR%2Cel_CY%2Cen_GB%2Cen_IE%2Cen_AU%2Cen_NZ%2Cen_CA%2Cen_US%2Cen_SG%2Cen_HK%2Cen_MY%2Cen_IN&product_sku={product_sku}&origin=www.plaisio.gr&merchant_identifier=plaisio-greece&since_period=YEAR",
        )
        reviews = r.json()

        review_score = reviews["rating"]["rating"]
        review_score = review_score if review_score else 0

        review_number = reviews["rating"]["product"]["count"]
        review_number = review_number if review_number else 0

        path = "/".join(product_sku)
        image = f"{image_src}/{path}/{product_sku}.jpg"

        yield {
            **response.meta.get("data"),
            "image": image,
            "categories": categories,
            "description": description_text,
            "review_score": review_score,
            "review_number": review_number,
        }
