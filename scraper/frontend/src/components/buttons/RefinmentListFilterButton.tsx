import { Dropdown } from "react-bootstrap";
import { RangeInput, RefinementList } from "react-instantsearch-hooks-web";
import { useParams } from "react-router-dom";
import RefinementListContainer from "../container/RefinementListContainer";

function RefinmentListFilterButton() {
  const { customerId } = useParams();
  const isCustomer = Boolean(customerId);

  return (
    <Dropdown.Menu>
      <div className="d-flex p-2 " style={{ gap: 5 }}>
        {!isCustomer ? (
          <RefinementListContainer label="Companies">
            <RefinementList
              attribute="customer_name"
              searchable
              searchablePlaceholder="Search customer"
              style={{ maxWidth: "215px" }}
              classNames={{
                item: "text-capitalize",
              }}
            />
          </RefinementListContainer>
        ) : (
          <></>
        )}
        <RefinementListContainer label="Categories">
          <RefinementList
            attribute="categories.name"
            limit={10}
            searchable
            searchablePlaceholder="Search customer category"
            style={{ maxWidth: "215px" }}
            classNames={{
              item: "text-capitalize",
            }}
          />
        </RefinementListContainer>
        <RefinementListContainer label="Scraper Categories">
          <RefinementList
            attribute="scraper_categories.name"
            limit={10}
            searchable
            searchablePlaceholder="Search scraper category"
            style={{ maxWidth: "215px" }}
            classNames={{
              item: "text-capitalize",
            }}
          />
        </RefinementListContainer>
        <RefinementListContainer label="Tags">
          <RefinementList
            attribute="tags"
            limit={10}
            searchable
            searchablePlaceholder="Search tag"
            style={{ maxWidth: "215px" }}
            classNames={{
              item: "text-capitalize",
            }}
          />
        </RefinementListContainer>
        <RefinementListContainer label="Price Range">
          {/* <RefinementList
            attribute="price"
            limit={10}
            searchable
            searchablePlaceholder="Search price"
            style={{ maxWidth: "215px" }}
          /> */}
          <RangeInput attribute="price_usd" />
        </RefinementListContainer>
      </div>
    </Dropdown.Menu>
  );
}

export default RefinmentListFilterButton;
