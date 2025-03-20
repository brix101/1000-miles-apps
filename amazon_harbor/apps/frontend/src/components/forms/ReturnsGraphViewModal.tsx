import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetReturnPerProduct from "@/hooks/queries/useGetReturnPerProduct";
import useBoundStore from "@/hooks/useBoundStore";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import Modal from "react-bootstrap/Modal";

function ReturnsGraphViewModal() {
  const closeDialog = useBoundStore((state) => state.closeDialog);
  const { data: returnedPerProduct } = useGetReturnPerProduct();

  return (
    <>
      <Modal.Header closeButton>
        <div className="custom-modal-title"></div>
      </Modal.Header>
      <Modal.Body>
        <p className="text-700 lead mb-2 mt-4">Period Overview</p>
        <div className="container row col-6">
          <div className="card col mb-5 mx-2">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
                <p className="fw-bold mb-1">Total Returned</p>
                <h3 className="fw-bolder text-nowrap text-success">$1250.00</h3>
                <p className="card-text"></p>
              </div>
            </div>
          </div>
          <div className="card col mb-5 mx-2">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
                <p className="fw-bold mb-1">Total Units Returned</p>
                <h3 className="fw-bolder text-nowrap text-success">10</h3>
                <p className="card-text"></p>
              </div>
            </div>
          </div>
        </div>
        <Table>
          <colgroup span={4}></colgroup>
          <colgroup span={3} className="bg-light"></colgroup>
          <colgroup span={3}></colgroup>

          <TableHeader>
            <TableRow>
              <TableHead colSpan={4}></TableHead>
              <TableHead colSpan={3}>
                Last Year (Jan-17, 2023 to Jan-18, 2023)
              </TableHead>
              <TableHead colSpan={3}>
                Custom Period (Aug-17, 2023 to Aug-18, 2023)
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Return Amount</TableHead>
              <TableHead>Units Return</TableHead>

              <TableHead>Return Amount</TableHead>
              <TableHead>Units Return</TableHead>
              <TableHead>Comparison</TableHead>

              <TableHead>Return Amount</TableHead>
              <TableHead>Units Return</TableHead>
              <TableHead>Comparison</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returnedPerProduct.map((returned, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{returned.productName}</TableCell>
                  <TableCell>{returned.brand}</TableCell>
                  <TableCell>
                    <span className="text-success">
                      $ {returned.returnAmount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="">{returned.unitsReturned}</span>
                  </TableCell>
                  {returned.comparison.map((comparison, comIndex) => {
                    const returnedPercentage =
                      ((comparison.returnAmount - returned.returnAmount) /
                        comparison.returnAmount) *
                      100;

                    const isHigher =
                      comparison.returnAmount > returned.returnAmount;

                    const textColor = cn(
                      isHigher ? "text-success" : "text-danger"
                    );
                    return (
                      <Fragment key={index + comIndex}>
                        <TableCell>
                          <span className={textColor}>
                            $ {comparison.returnAmount.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="">$ {comparison.unitsReturned}</span>
                        </TableCell>
                        <TableCell>
                          <span className={textColor}>
                            {returnedPercentage.toFixed(2)}%
                          </span>
                        </TableCell>
                      </Fragment>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button>Download Excel</Button>
        <Button variant="outline-secondary" onClick={closeDialog}>
          Back
        </Button>
      </Modal.Footer>
    </>
  );
}

export default ReturnsGraphViewModal;
