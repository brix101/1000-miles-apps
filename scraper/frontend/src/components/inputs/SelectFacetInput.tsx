import { Icons } from "@/assets/icons";
import { IFacets } from "@/schema/facets.schema";
import { useQueryExcludedWords } from "@/services/exludedWord.service";
import { useQueryFacets } from "@/services/facets.service";
import React, { MouseEvent, Ref, forwardRef, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { FieldError } from "react-hook-form";
import { Inputs } from ".";
import ErrorContainer from "../container/ErrorContainer";

interface ComponentProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
  label?: string;
  facet?: keyof IFacets;
  selectedItems?: Array<string>;
  onSelectItem?: (selected: string) => void;
}
interface CustomToggleProps {
  children: React.ReactNode;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const CustomToggle = React.forwardRef<HTMLAnchorElement, CustomToggleProps>(
  ({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{
        overflow: "hidden",
      }}
    >
      {children}
      {/* &#x25bc; */}
    </a>
  )
);

interface CustomMenuProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  "aria-labelledby": string;
  isLoading?: boolean;
}

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef<HTMLDivElement, CustomMenuProps>(
  (
    { children, style, className, "aria-labelledby": labeledBy, isLoading },
    ref
  ) => {
    const [value, setValue] = useState("");
    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <div className="w-100 my-2 px-4">
          <div
            className="search-box"
            style={{
              position: "relative",
              fontSize: ".8rem",
              width: "100%",
            }}
          >
            <Inputs.Primary
              type="search"
              placeholder="Search..."
              disabled={isLoading}
              leftIcon={
                isLoading ? (
                  <div className="search-box-icon">
                    <span
                      className="spinner-border spinner-border-sm "
                      style={{ height: 14, width: 14 }}
                    ></span>
                  </div>
                ) : (
                  <Icons.FiSearch
                    className="fas fa-search search-box-icon"
                    height={16}
                    width={16}
                  />
                )
              }
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
          </div>
        </div>
        <ul
          className="list-unstyled scrollbar-overlay px-4"
          style={{
            height: "20rem",
          }}
        >
          {React.Children.toArray(children).filter(
            (child) =>
              typeof child === "object" &&
              React.isValidElement(child) &&
              child.props.children
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase())
          )}
        </ul>
      </div>
    );
  }
);

const SelectFacetInput: React.FC<ComponentProps> = forwardRef<
  HTMLInputElement,
  ComponentProps
>(
  (
    {
      error,
      label,
      facet = "scraper_categories.name",
      selectedItems,
      onSelectItem,
      ...props
    }: ComponentProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const { data: wordsData } = useQueryExcludedWords();
    const { data, isLoading } = useQueryFacets();
    const hasValue = Boolean(props.value);

    function handleItemClick(value: string) {
      if (typeof onSelectItem === "function") {
        onSelectItem(value);
      }
    }

    const dataItem = data?.[facet] ?? [];
    let items = dataItem;

    if (facet === "tags") {
      const wordsSet = new Set(
        wordsData?.words.map((word) => word.word?.toLowerCase())
      );
      items = dataItem.filter((item) => !wordsSet.has(item.toLowerCase()));
    }

    const filterSet = new Set(selectedItems);
    const filterItems = items.filter((item) => !filterSet.has(item));

    const dropDownItems = filterItems.map((item, idx) => (
      <Dropdown.Item className="border-bottom" key={idx} eventKey={item}>
        {item}
      </Dropdown.Item>
    ));

    return (
      <Dropdown
        className="text-start"
        autoClose="outside"
        onSelect={(e) => handleItemClick(e ?? "")}
      >
        {label ? <label className="form-label">{label}</label> : undefined}
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          <Inputs.Primary
            ref={ref}
            className={`form-control`}
            placeholder={props.placeholder}
            readOnly={true}
            rightIcon={
              <Dropdown.Item
                as={Button}
                className={`
                  btn btn-icon btn-sm password-button border rounded-circle 
                  ${!hasValue ? "d-none" : ""}
                `}
                eventKey={""}
              >
                X
              </Dropdown.Item>
            }
            {...props}
          />
        </Dropdown.Toggle>
        <Dropdown.Menu as={CustomMenu} className="w-100" isLoading={isLoading}>
          {dropDownItems}
          <div className="d-flex justify-content-center py-2">
            <button className="btn btn-phoenix-primary btn-sm w-100" disabled>
              Nothing more to load
            </button>
          </div>
        </Dropdown.Menu>
        <ErrorContainer error={error} />
      </Dropdown>
    );
  }
);

export default SelectFacetInput;
