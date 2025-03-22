import { useCallback, useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";

type ReactPaginateProps = React.ComponentProps<typeof ReactPaginate>;

interface Props<T> {
  items: T[];
  itemsPerPage?: number;
}

export default function useItemPagination<T>(props: Props<T>) {
  const items = props.items;
  const defaultLimit = props.itemsPerPage ?? 10;

  const [paginationState, setPaginationState] = useState<{
    itemOffset: number;
    itemsPerPage: number;
    forcePage?: number;
    lastPage: number;
  }>({
    itemOffset: 0,
    itemsPerPage: defaultLimit,
    forcePage: -1,
    lastPage: 0,
  });

  const { itemOffset, itemsPerPage, forcePage, lastPage } = paginationState;

  const pageCount = useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items.length, itemsPerPage]
  );

  const currentItems = useMemo(() => {
    const endOffset = itemOffset + itemsPerPage;
    return items.slice(itemOffset, endOffset);
  }, [items, itemOffset, itemsPerPage]);

  const startIndex = itemOffset + 1;
  const endIndex = Math.min(itemOffset + itemsPerPage, items.length);

  function handlePageClick(event: { selected: number }) {
    const newOffset = event.selected * itemsPerPage;
    setPaginationState({
      ...paginationState,
      itemOffset: newOffset,
      forcePage: undefined,
    });
  }

  function handleItemsPerPage() {
    if (pageCount > 1 || itemsPerPage > defaultLimit) {
      if (itemsPerPage === items.length) {
        setPaginationState({
          ...paginationState,
          itemsPerPage: defaultLimit,
          itemOffset: lastPage * defaultLimit,
          forcePage: lastPage,
        });
      } else {
        setPaginationState({
          ...paginationState,
          itemsPerPage: items.length,
          lastPage: itemOffset / itemsPerPage,
          itemOffset: 0,
          forcePage: 0,
        });
      }
    } else if (startIndex > endIndex) {
      setPaginationState((prevState) => ({
        ...prevState,
        itemOffset: 0,
        forcePage: 0,
      }));
    }
  }

  const reset = useCallback(() => {
    if (startIndex > endIndex) {
      setPaginationState((prevState) => ({
        ...prevState,
        itemOffset: 0,
        forcePage: 0,
      }));
    }
  }, [endIndex, startIndex]);

  useEffect(() => {
    reset(); // Reset pagination state when items change
  }, [items, reset]);

  const paginationProps: ReactPaginateProps = {
    breakLabel: "...",
    nextLabel: "›",
    onPageChange: handlePageClick,
    pageRangeDisplayed: 5,
    marginPagesDisplayed: 1,
    pageCount: pageCount,
    previousLabel: "‹",
    renderOnZeroPageCount: null,
    containerClassName: "justify-content-center pagination",
    previousClassName: "page-item",
    previousLinkClassName: "page-link",
    nextClassName: "page-item",
    nextLinkClassName: "page-link",
    pageClassName: "page-item",
    pageLinkClassName: "page-link",
    breakClassName: "page-item",
    breakLinkClassName: "page-link",
    activeClassName: "active",
    disabledClassName: "disabled",
    forcePage: forcePage,
  };

  const statusProps = {
    startIndex,
    endIndex,
    count: items.length,
    itemsPerPage,
    onClick: handleItemsPerPage,
  };

  return {
    currentItems,
    startIndex,
    endIndex,
    count: items.length,
    pageCount,
    statusProps,
    paginationProps,
  };
}
