import scrapy
import requests
import re

website = "https://www.theworks.co.uk"
currency_sym = "£"
pass_key = "ca5exUIDzeCBo5D7Ws2whmGZWdwsQX04reP12RA5RfF8s"


class TheWorksSpider(scrapy.Spider):
    name = "the_works"
    allowed_domains = ["www.theworks.co.uk"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request(website, callback=self.start_scraping)

    def start_scraping(self, response):
        nav_items = response.css("li.mega-nav-col a")

        for nav in nav_items:
            nav_link = nav.attrib["href"]
            if nav_link and website not in nav_link:
                nav_link = website + nav_link

            yield scrapy.Request(
                nav_link,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )

    def parse_item(self, response):
        current_url = response.url
        product_count_text = response.css(
            "div.col-12.search-results-count p::text"
        ).get()
        product_count = (
            product_count_text.strip().split()[0] if product_count_text else 0
        )

        if "?tsz=" in current_url:
            products = response.css("div.product-tile")
            for product in products:
                product_title = product.css(
                    "div.product-tile-pdp-link.product-tile-pdp-bookmark"
                )
                product_title_a = product_title.css("a")
                href = product_title_a.attrib.get("href", "")
                name = product_title_a.css("::text").get().strip()
                price = response.css("span.sales span.value::attr(content)").get()
                price = price.strip() if price else 0
                image = product.css("img.product-tile-tile-image").attrib["src"]
                image = image.replace("?sw=200&sh=200&sm=fit", "") if image else ""

                categories = []
                categories_nav = response.css(
                    "ul.breadcrumb-container.d-none.d-mv-inline-flex li.breadcrumb-item"
                )
                for index, category_item in enumerate(categories_nav, start=0):
                    if not category_item.css(
                        'a.breadcrumb-item--link:contains("Home")'
                    ):
                        item_name = (
                            category_item.css("a.breadcrumb-item--link::text")
                            .extract_first(default="")
                            .strip()
                        )
                        categories.append({"name": item_name, "level": index - 1})

                data = {
                    "name": name,
                    "price": float(price),
                    "categories": categories,
                    "image": image,
                }

                yield scrapy.Request(
                    website + href,
                    callback=self.parse_product,
                    meta={"data": data},
                )

        elif "?tsz=" not in current_url and float(product_count) > 0:
            yield scrapy.Request(
                current_url + f"?tsz={product_count}",
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )
        else:
            pass

    def parse_product(self, response):
        product_details_div = response.css("div.row.product-details-details")
        description = product_details_div.css("strong::text").extract_first()
        product_id = response.css("div.bv-rating-display").attrib["data-bv-product-id"]
        headers = {"Accept": "application/json"}
        r = requests.get(
            f"https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey={pass_key}&productid={product_id}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=en*,en_AU",
            headers=headers,
        )
        reviews = r.json()

        num_reviews = reviews["reviewSummary"]["numReviews"]
        num_reviews = num_reviews if num_reviews else 0
        score = reviews["reviewSummary"]["primaryRating"]["average"]
        score = score if score else 0

        filtered_description = (
            re.sub("<!--\ntd.*?\n-->", "", description) if description else ""
        )

        yield {
            **response.meta.get("data"),
            "description": filtered_description,
            "review_score": score,
            "review_number": num_reviews,
        }
