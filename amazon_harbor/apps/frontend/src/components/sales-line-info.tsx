import { Icons } from "@/components/icons";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import React, { ForwardedRef, MouseEvent } from "react";
import Dropdown from "react-bootstrap/Dropdown";

interface CustomToggleProps {
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const CustomToggle = React.forwardRef(
  ({ onClick }: CustomToggleProps, ref: ForwardedRef<HTMLAnchorElement>) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <Icons.UInfoCircle className="text-info" />
    </a>
  )
);

function SalesLineInfo() {
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        Custom toggle
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <div className="card p-2">
          <Table className="table-striped">
            <TableHeader>
              <TableRow>
                <th>Charge</th>
                <th>Cost</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <td className="text-nowrap">Cost of Goods</td>
                <td className="text-danger">$342.20</td>
              </TableRow>
              <TableRow>
                <td className="text-nowrap">FBA Fullfillment Fee</td>
                <td className="text-danger">$252.00</td>
              </TableRow>
              <TableRow>
                <td className="text-nowrap">Referal Fee</td>
                <td className="text-danger">$102.20</td>
              </TableRow>
              <TableRow>
                <td className="text-nowrap">PPC Fee</td>
                <td className="text-danger">$98.50</td>
              </TableRow>
              <TableRow>
                <td className="text-nowrap">Inventory Fee</td>
                <td className="text-danger">$42.20</td>
              </TableRow>
              <TableRow>
                <td className="text-nowrap">Refund Administration</td>
                <td className="text-danger">$12.20</td>
              </TableRow>
              <TableRow>
                <td className="text-nowrap">FBA Disposal Fee</td>
                <td className="text-danger">$7.20</td>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SalesLineInfo;
