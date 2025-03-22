import { Icons } from "@/assets/icons";
import ProductViewButton from "@/components/buttons/ProductViewButton";
import { Inputs } from "@/components/inputs";
import {
  INSTANT_SEARCH_PRODUCTS,
  INSTANT_SEARCH_PRODUCTS_SUGGESTIONS,
} from "@/constant/algolia.constant";
import searchClient from "@/utils/searchClient";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useCurrentRefinements } from "react-instantsearch-hooks-web";
import { CustomToggleButton } from "../CustomToggle";
import { AlgoliaCustomPagination } from "../PaginationComponent";
import { Buttons } from "../buttons";
import ProductHits from "../hits/ProductHits";

function ProductsContainer() {
  const [groupBy, setGroupBy] = useState<"customer" | "category" | null>(null);

  const currentRefinementList = useCurrentRefinements();

  const refinementListCount = currentRefinementList.items
    .filter((item) => item.attribute !== "hierarchicalCategories.lvl0")
    .reduce((count, item) => count + item.refinements.length, 0);

  const showIndicator = refinementListCount > 0;

  function handleGroupBy(by: "customer" | "category") {
    setGroupBy((prev) => {
      if (prev == by) {
        return null;
      } else {
        return by;
      }
    });
  }

  return (
    <>
      <div id="products">
        <div className="mb-2">
          <div className="row">
            <div className="col-4">
              <Inputs.AlgoliaAutoComplete
                placeholder="Search product"
                recentSearchesOptions={{
                  key: INSTANT_SEARCH_PRODUCTS,
                }}
                suggestionOptions={{
                  indexName: INSTANT_SEARCH_PRODUCTS_SUGGESTIONS,
                  searchClient: searchClient,
                }}
              />
            </div>
            <div className="col-2 flex-grow-1 d-flex align-items-center">
              <Dropdown>
                <Dropdown.Toggle
                  as={CustomToggleButton}
                  className="icon-indicator icon-indicator-primary"
                  indicator={showIndicator}
                >
                  {showIndicator ? (
                    <span className="icon-indicator-number">
                      {refinementListCount}
                    </span>
                  ) : (
                    <></>
                  )}
                  <Icons.UFilter height={20} width={20} />
                </Dropdown.Toggle>
                <Buttons.RefinmentListFilterButton />
              </Dropdown>
              <Dropdown
                style={{
                  padding: 0,
                  display: "none",
                }}
              >
                <Dropdown.Toggle as={CustomToggleButton}>
                  <Icons.ULayerGroup height={20} width={20} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    disabled
                    style={{
                      fontSize: "12px",
                      color: "var(--phoenix-dropdown-link-color)",
                    }}
                  >
                    GROUP BY :
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={"button"}
                    className="border-top d-flex justify-content-between"
                    onClick={() => handleGroupBy("customer")}
                  >
                    <span>Customer</span>
                    {groupBy === "customer" ? <Icons.FiCheck /> : undefined}
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={"button"}
                    className="border-top d-flex justify-content-between"
                    onClick={() => handleGroupBy("category")}
                  >
                    <span>Category</span>
                    {groupBy === "category" ? <Icons.FiCheck /> : undefined}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-auto d-flex align-items-center">
              <ProductViewButton />
            </div>
          </div>
        </div>
        <ProductHits />
        <div className="row align-items-center justify-content-between py-2 bg-white mx-n4 px-4 mx-lg-n6 px-lg-6 border">
          <div className="col-auto d-flex">
            <p
              className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900"
              data-list-info="data-list-info"
            >
              {/* {startIndex} to {endIndex}{" "}
            <span className="text-600"> Items of </span>
            {productCount} */}
            </p>
            <a className="fw-semi-bold  d-none" href="#!" data-list-view="*">
              View all
              <span
                className="fas fa-angle-right ms-1"
                data-fa-transform="down-1"
              ></span>
            </a>
            <a className="fw-semi-bold d-none" href="#!" data-list-view="less">
              View Less
              <span
                className="fas fa-angle-right ms-1"
                data-fa-transform="down-1"
              ></span>
            </a>
          </div>
          {/* Pagination Item Here */}
          <div className="col-auto d-flex ">
            <AlgoliaCustomPagination />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductsContainer;
