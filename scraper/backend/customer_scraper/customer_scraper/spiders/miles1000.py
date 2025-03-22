import scrapy
import requests

website = "https://www.1000miles.biz"
currency_sym = "$"


class MilesSpider(scrapy.Spider):
    name = "miles"
    allowed_domains = ["www.1000miles.biz"]

    custom_settings = {
        "ZYTE_API_TRANSPARENT_MODE": False,
    }

    def start_requests(self):
        yield scrapy.Request(
            website
            + "/showroom/collections/login/8862/1103304760mi568lesSho74wroo14mOnl896ineLo25gin756",
            callback=self.start_scraping,
        )

    def start_scraping(self, response):
        nav_items = response.css(
            "li.options_li_menus.option_li_categ a.see_options_li, a.ol_showrm_colls_col.col-md-4.col_goto_collection"
        )
        for nav in nav_items:
            nav_link = nav.attrib["href"]
            nav_link = (
                nav_link.replace("show_menu", "show_product_categories")
                if nav_link
                else nav_link
            )
            yield scrapy.Request(
                nav_link,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )

    def parse_item(self, response):
        current_url = response.url
        products = response.css("a.assort_col.col-md-auto")
        product_count = len(products)
        has_next = product_count >= 15

        breadcrumb_element = response.css("div.bread_crumb div.crumb span")
        breadcrumb_strings = breadcrumb_element.xpath(
            "descendant-or-self::*/text()"
        ).getall()

        breadcrumb_strings = [
            string.strip().replace("/", "")
            for string in breadcrumb_element.xpath(
                "descendant-or-self::*/text()"
            ).getall()
            if string.strip()
            and not (string.strip().lower() == "home" or not string.strip())
        ]

        categories = [
            {"name": name.replace("By ", ""), "level": index}
            for index, name in enumerate(breadcrumb_strings, start=-1)
            if name
        ]

        for product in products:
            # product_link = product.attrib["href"]
            name = product.css("div.ttl::text").get().strip()
            image = product.css("div.img img::attr(src)").get()
            price_element = product.css("div.det::text").get().strip()
            lowest_price = 0
            if price_element:
                prices = price_element.replace("Price:", "").replace("$", "").split("-")
                prices = [float(price.strip()) for price in prices]
                lowest_price = min(prices)

            yield {
                "name": name,
                "price": lowest_price,
                "categories": categories,
                "image": image,
                "description": "",
            }

        print(has_next, "=========================", product_count, current_url)
        if "?page=" not in current_url:
            current_url = current_url + "?page=2"
        else:
            split_url = current_url.split("?page=")
            next_page_number = int(split_url[-1]) + 1
            current_url = split_url[0]
            current_url = current_url + f"?page={next_page_number}"

        if has_next:
            yield scrapy.Request(
                current_url,
                callback=self.parse_item,
                dont_filter=True,
                meta={"deltafetch_enabled": False},
            )
