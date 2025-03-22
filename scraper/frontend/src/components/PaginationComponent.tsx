import { Icons } from "@/assets/icons";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "react-feather";
import { usePagination } from "react-instantsearch-hooks-web";
import ReactPaginate from "react-paginate";

type PaginationSectionProps = React.ComponentProps<typeof ReactPaginate>;

type PaginationStatusProps = {
  startIndex: number;
  endIndex: number;
  count: number;
  itemsPerPage: number;
  onClick: () => void;
};

function PaginationStatus({
  startIndex,
  endIndex,
  count,
  itemsPerPage,
  onClick,
}: PaginationStatusProps) {
  const isViewAll = count === itemsPerPage;

  return (
    <div className="d-flex align-items-center">
      <p
        className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900"
        data-list-info="data-list-info"
      >
        {startIndex} to {endIndex} <span className="text-600"> Items of </span>
        {count}
      </p>
      <button className="fw-semi-bold btn-link btn" onClick={onClick}>
        View {isViewAll ? "less" : "all"}
        <Icons.FiChevronRight width={14} height={14} className="ms-1" />
      </button>
    </div>
  );
}

function PaginationSection(paginationProps: PaginationSectionProps) {
  return <ReactPaginate {...paginationProps} />;
}

function AlgoliaCustomPagination() {
  const { nbPages, refine: setPage } = usePagination();

  return (
    <ReactPaginate
      // forcePage={items.currentRefinement}
      renderOnZeroPageCount={null}
      pageCount={nbPages}
      pageRangeDisplayed={5}
      onPageChange={(e) => setPage(e.selected)}
      breakLabel={<MoreHorizontal size={14} />}
      nextLabel={<ChevronRight size={14} />}
      previousLabel={<ChevronLeft size={14} />}
      containerClassName="justify-content-center align-items-center pagination p-0 m-0"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      activeClassName="active"
      disabledClassName="disabled"
    />
  );
}

export { AlgoliaCustomPagination, PaginationSection, PaginationStatus };
