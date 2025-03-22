import { Icons } from "@/assets/icons";
import { CategoryEntity } from "@/schema/category.schema";
import { useInfiniteQueryPaginatedCategories } from "@/services/category.service";
import React, { MouseEvent, Ref, forwardRef, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FieldError } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "usehooks-ts";
import { Inputs } from ".";
import ErrorContainer from "../container/ErrorContainer";

interface SelectOptions {
  value: string;
  label: string;
}

interface ComponentProps extends React.SelectHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
  label?: string;
  options?: SelectOptions[];
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
  filter: string;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef<HTMLDivElement, CustomMenuProps>(
  (
    {
      children,
      style,
      className,
      "aria-labelledby": labeledBy,
      isLoading,
      filter,
      onFilterChange,
    },
    ref
  ) => {
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
              onChange={onFilterChange}
              value={filter}
            />
          </div>
        </div>
        <ul
          className="list-unstyled scrollbar-overlay px-4"
          style={{
            height: "20rem",
          }}
        >
          {React.Children.toArray(children)}
        </ul>
      </div>
    );
  }
);

const SelectCategoryInput: React.FC<ComponentProps> = forwardRef<
  HTMLInputElement,
  ComponentProps
>(({ error, label, ...props }: ComponentProps, ref: Ref<HTMLInputElement>) => {
  const { ref: inViewRef, inView } = useInView();
  const [filter, setFilterValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryEntity | undefined
  >(undefined);

  const debouncedFilter = useDebounce(filter, 500);
  const { data, isFetchingNextPage, isLoading, fetchNextPage, hasNextPage } =
    useInfiniteQueryPaginatedCategories(100, debouncedFilter);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFilterValue(event.target.value);
  }

  useEffect(() => {
    if (isLoading) {
      setSelectedCategory(undefined);
    }
  }, [isLoading]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <Dropdown className="text-start" autoClose="outside">
      {label ? <label className="form-label">{label}</label> : undefined}
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        <Inputs.Primary
          ref={ref}
          className={`form-control`}
          value={selectedCategory?.category ?? ""}
          placeholder={props.placeholder}
          rightIcon={
            <button
              className={`btn btn-icon password-button border rounded-circle ${
                !selectedCategory ? "d-none" : ""
              }`}
              onClick={() => setSelectedCategory(undefined)}
            >
              X
            </button>
          }
        />
      </Dropdown.Toggle>
      <Dropdown.Menu
        as={CustomMenu}
        className="w-100"
        isLoading={isLoading}
        filter={filter}
        onFilterChange={handleSearchChange}
      >
        {data?.pages.map((page, idx) => (
          <React.Fragment key={idx}>
            {page.data.categories.map((category) => (
              <Dropdown.Item
                className="border-bottom"
                key={category.id}
                eventKey={category.id}
                onClick={() => setSelectedCategory(category)}
              >
                {category.category}
              </Dropdown.Item>
            ))}
          </React.Fragment>
        ))}
        <div className="d-flex justify-content-center py-2">
          <button
            className="btn btn-phoenix-primary btn-sm w-100"
            ref={inViewRef}
            onClick={(e) => {
              e.preventDefault();
              fetchNextPage();
            }}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load Newer"
              : "Nothing more to load"}
          </button>
        </div>
      </Dropdown.Menu>
      <ErrorContainer error={error} />
    </Dropdown>
  );
});

export default SelectCategoryInput;
