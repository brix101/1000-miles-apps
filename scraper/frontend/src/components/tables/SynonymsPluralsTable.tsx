import { Icons } from "@/assets/icons";
import useItemFilters from "@/hooks/useItemFilters";
import useItemPagination from "@/hooks/useItemPagination";
import { WordsEntity } from "@/schema/word.schema";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { PaginationSection, PaginationStatus } from "../PaginationComponent";
import { Inputs } from "../inputs";
import WordModal from "../modals/WordModal";
import WordRow from "../rows/WordRow";

function SynonymsPluralsTable({ data }: { data?: WordsEntity }) {
  const [filter, setFilter] = useState<string | undefined>(undefined);

  const { result } = useItemFilters({
    rows: data?.words ?? [],
    skip: ["_id", "id"],
    filter,
  });

  const { currentItems, paginationProps, statusProps } = useItemPagination({
    items: result,
    itemsPerPage: 15,
  });

  function handleFilterString(event: React.ChangeEvent<HTMLInputElement>) {
    setFilter(event.target.value);
  }

  return (
    <>
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-auto">
          <div className="search-box">
            <Inputs.Primary
              type="search"
              placeholder="Search word"
              leftIcon={
                <Icons.FiSearch
                  className="fas fa-search search-box-icon"
                  height={16}
                  width={16}
                />
              }
              value={filter}
              onChange={handleFilterString}
            />
          </div>
        </div>
      </div>
      <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
        <div className="min-vh-70">
          <Table responsive className="fs--1">
            <thead>
              <tr>
                <th
                  className="sort align-middle text-uppercase"
                  scope="col"
                  style={{ width: "40%" }}
                >
                  Word
                </th>
                <th
                  className="sort align-middle text-uppercase"
                  scope="col"
                  style={{ width: "40%" }}
                >
                  Language
                </th>
                <th
                  className="sort align-middle text-end pe-0  text-uppercase"
                  scope="col"
                  style={{ width: "20%" }}
                ></th>
              </tr>
            </thead>
            <tbody className="list">
              {currentItems?.map((word, index) => (
                <WordRow key={index} word={word} />
              ))}
            </tbody>
          </Table>
        </div>
        <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
          <div className="col-auto">
            <PaginationStatus {...statusProps} />
          </div>
          <div className="col-auto">
            <PaginationSection {...paginationProps} />
          </div>
        </div>
      </div>
      <WordModal words={result ?? []} />
    </>
  );
}

export default SynonymsPluralsTable;
