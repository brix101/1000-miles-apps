import { ProductEntity } from "@/schema/product.schema";
import { useBoundStore } from "@/store";
import { RefinementListRenderState } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import moment from "moment";
import { useContext, useState } from "react";
import { Highlight } from "react-instantsearch-hooks-web";
import { ProductHitsContext } from "../hits/ProductHits";

const DEFAULT_BADGE_LENGTH = 3;

function ProductRow({ product }: { product: AlgoliaHit<ProductEntity> }) {
  const { setProductToModal } = useBoundStore();
  const {
    excludedWords,
    tagsRefinement,
    categoriesRefinement,
    scrapercategoriesRefinement,
  } = useContext(ProductHitsContext);
  const [badgeLength, setBadgeLength] = useState<number>(DEFAULT_BADGE_LENGTH);

  const { items, refine: setTagRefinementList } =
    tagsRefinement as RefinementListRenderState;

  const { items: categoriesItems, refine: setcategoriesRefinement } =
    categoriesRefinement as RefinementListRenderState;

  const {
    items: scraperCategoriesItems,
    refine: setscrapercategoriesRefinement,
  } = scrapercategoriesRefinement as RefinementListRenderState;

  const categories =
    product?.categories.map((category) => {
      const isActive = categoriesItems.find(
        (item) => item.label.toLowerCase() === category.name.toLowerCase()
      )?.isRefined;

      return (
        <span
          key={category.level}
          className="text-decoration-none cursor-pointer"
          style={{ userSelect: "none" }}
          onClick={() => setcategoriesRefinement(category.name)}
        >
          <span
            className={`badge badge-category me-2 mb-2 ${
              isActive ? "bg-primary text-light" : ""
            }`}
          >
            {category.name}
          </span>
        </span>
      );
    }) ?? [];
  const scraper_categories =
    product?.scraper_categories?.map((category) => {
      const isActive = scraperCategoriesItems.find(
        (item) => item.label.toLowerCase() === category.name.toLowerCase()
      )?.isRefined;

      return (
        <span
          key={category.level}
          className="text-decoration-none cursor-pointer"
          style={{ userSelect: "none" }}
          onClick={() => setscrapercategoriesRefinement(category.name)}
        >
          <span
            className={`badge badge-scraper-category me-2 mb-2 ${
              isActive ? "bg-primary text-light" : ""
            }`}
          >
            {category.name}
          </span>
        </span>
      );
    }) ?? [];
  const tags = product?.tags ?? [];

  const currencySymbol = "$"; //customer?.currency.symbol ?? "$";
  const recomended_sp =
    product.price_usd && product.markup
      ? product.price_usd / product.markup
      : 0;
  const markup = product.markup;
  const price = product.price_usd?.toFixed(2);
  const image = product?.image ?? "";
  const createAt = product.created_at;
  const datePosted = moment(createAt).format("MMM DD, YYYY");

  const productTags = tags
    .filter((tag) => !excludedWords.find((word) => word.word === tag))
    .map((tag, index) => {
      const isActive = items.find(
        (item) => item.label.toLowerCase() === tag.toLowerCase()
      )?.isRefined;

      return (
        <span
          key={index}
          className="text-decoration-none cursor-pointer"
          style={{ userSelect: "none" }}
          onClick={() => setTagRefinementList(tag)}
        >
          <span
            className={`badge badge-tag me-2 mb-2 ${
              isActive ? "bg-primary text-light" : ""
            }`}
          >
            {tag}
          </span>
        </span>
      );
    });

  function handleSeeMoreClick() {
    setBadgeLength((prev) => {
      if (prev === DEFAULT_BADGE_LENGTH) {
        return tags.length;
      } else {
        return DEFAULT_BADGE_LENGTH;
      }
    });
  }

  return (
    <tr className="position-static py-2">
      <td className="align-middle white-space-nowrap py-2">
        <div
          className="border rounded-2 cursor-pointer overflow-hidden d-flex justify-content-center align-content-center"
          style={{ width: 75, height: 75 }}
        >
          <img
            src={image}
            alt="Image"
            onClick={() => setProductToModal(product)}
            className="img-fluid"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              display: "block",
              margin: "auto",
              objectFit: "contain",
            }}
          />
        </div>
      </td>
      <td className="product align-middle ps-4">
        <a
          className="fw-semi-bold line-clamp-3 mb-0"
          href="#!"
          onClick={() => setProductToModal(product)}
        >
          {/* {product.name} */}
          <Highlight hit={product} attribute="name" />
        </a>
      </td>
      <td className="price align-middle white-space-nowrap fw-bold text-700 ps-4">
        <Highlight hit={product} attribute="customer_name" />
      </td>
      <td className="category align-middle text-600 fs--1 ps-4 fw-semi-bold">
        <div>{categories}</div>
      </td>
      <td className="tags align-middle review pb-2 ps-3">
        <div>{scraper_categories}</div>
      </td>
      <td className="tags align-middle review pb-2 ps-3">
        <div>{productTags.slice(0, badgeLength)}</div>
        {tags.length > DEFAULT_BADGE_LENGTH ? (
          <span
            className="btn-link text-primary cursor-pointer"
            onClick={handleSeeMoreClick}
          >
            See {tags.length <= badgeLength ? "less" : "more"}
          </span>
        ) : null}
      </td>
      <td className="time align-middle white-space-nowrap text-600 ps-4">
        {datePosted}
      </td>
      <td className="price align-middle white-space-nowrap fw-bold text-700 ps-4">
        {currencySymbol} {price}
      </td>
      <td className="markup align-middle text-600 ps-4">
        {markup && `${markup}`}
      </td>
      <td className="markup align-middle text-600 ps-4">
        {currencySymbol} {recomended_sp?.toFixed(2)}
      </td>
    </tr>
  );
}

export default ProductRow;
