import { useContext } from "react";
import { Table } from "react-bootstrap";
import { ProductHitsContext } from "../hits/ProductHits";
import ProductRow from "../rows/ProductRow";

function ProductListView() {
  const { products } = useContext(ProductHitsContext);

  return (
    <div className="mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white border-top border-bottom border-200 position-relative top-1">
      <div className="min-vh-70">
        <Table responsive className="fs--1">
          <thead>
            <tr>
              <th
                className="text-uppercase white-space-nowrap align-middle fs--2"
                scope="col"
                style={{ width: "70px" }}
              ></th>
              <th
                className="white-space-nowrap align-middle ps-4"
                style={{ width: "350px" }}
              >
                PRODUCT NAME
              </th>
              <th className="align-middle ps-4" style={{ width: "150px" }}>
                CUSTOMER NAME
              </th>
              <th
                className="text-uppercase align-middle ps-4"
                style={{ width: "150px" }}
              >
                CUSTOMER CATEGORY
              </th>
              <th
                className="text-uppercase align-middle ps-4"
                style={{ width: "150px" }}
              >
                SCRAPER CATEGORY
              </th>
              <th
                className="text-uppercase align-middle ps-4"
                style={{ width: "250px" }}
              >
                TAGS
              </th>
              <th
                className="text-uppercase align-middle ps-4"
                style={{ width: "50px" }}
              >
                DATE POSTED
              </th>
              <th
                className="text-uppercase align-middle ps-4"
                style={{ width: "150px" }}
              >
                Customer <br />
                Sales PRICE
              </th>
              <th
                className="text-uppercase align-middle ps-4"
                style={{ width: "50px" }}
              >
                MARKUP
              </th>
              <th
                className="text-uppercase align-middle ps-4"
                style={{ width: "50px" }}
              >
                Recomended <br /> Sales Price
              </th>
            </tr>
          </thead>
          <tbody className="list">
            {products?.map((product, index) => (
              <ProductRow key={index} product={product} />
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ProductListView;
