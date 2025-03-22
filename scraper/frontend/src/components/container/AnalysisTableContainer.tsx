import { RefinementListItem } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";
import { Table } from "react-bootstrap";

interface TableProps extends RefinementListItem {
  highest?: number | null;
  lowest?: number | null;
  markup_percent?: number | null;
  currency?: string;
}

function AnalysisTableContainer({
  data,
  isLoading,
}: {
  data: TableProps[];
  isLoading?: boolean;
}) {
  data.sort((a, b) => b.count - a.count);
  return (
    <div className="card px-4 py-2">
      <Table responsive className="table table-lg fs--1">
        <thead>
          <tr>
            <th
              className="align-middle text-uppercase"
              style={{ width: "10%" }}
            >
              NAME
            </th>
            <th
              className="align-middle text-uppercase"
              style={{ width: "10%" }}
            >
              # of <br />
              products
            </th>
            <th
              className="align-middle text-uppercase"
              style={{ width: "10%" }}
            >
              Lowest price
            </th>
            <th
              className="align-middle text-uppercase"
              style={{ width: "10%" }}
            >
              highest price
            </th>
            <th
              className="align-middle text-uppercase"
              style={{ width: "10%" }}
            >
              markup
            </th>
          </tr>
        </thead>
        <tbody className="list" id="categories-table-body">
          {data.map((data, index) => (
            <tr key={index} className="position-static">
              <th className="align-middle text-capitalize fs--1 fw-semi-bold text-1000 ">
                {data.label}
              </th>
              <th className="align-middle fs--1 fw-semi-bold text-1000 ">
                {data.count}
              </th>
              <th className="align-middle fs--1 fw-semi-bold text-1000 ">
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    style={{ height: 14, width: 14 }}
                  ></span>
                ) : (
                  <>
                    {data.currency ?? "$"} {data.lowest?.toFixed(2) ?? 0}
                  </>
                )}
              </th>
              <th className="align-middle fs--1 fw-semi-bold text-1000 ">
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    style={{ height: 14, width: 14 }}
                  ></span>
                ) : (
                  <>
                    {data.currency ?? "$"} {data.highest?.toFixed(2) ?? 0}
                  </>
                )}
              </th>
              <th className="align-middle fs--1 fw-semi-bold text-1000 ">
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    style={{ height: 14, width: 14 }}
                  ></span>
                ) : (
                  <>{data.markup_percent?.toFixed(2)}</>
                )}
              </th>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AnalysisTableContainer;
