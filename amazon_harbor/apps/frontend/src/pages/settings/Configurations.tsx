import PageHeaderContainer from "@/components/container/page-header-Container";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Configurations() {
  const inventorySTatus = [
    {
      name: "High",
      dosMin: "75",
      dosMax: "80+",
      color: "#52A666",
      isWarnUsers: false,
    },
    {
      name: "Medium Low",
      dosMin: "45",
      dosMax: "75",
      color: "#e69138",
      isWarnUsers: false,
    },
    {
      name: "Very Low",
      dosMin: "44",
      dosMax: "30",
      color: "#cc0000",
      isWarnUsers: true,
    },
    {
      name: "Critical",
      dosMin: "0",
      dosMax: "29",
      color: "#cc0000",
      isWarnUsers: true,
    },
  ];
  return (
    <>
      <div className="d-flex justify-content-between">
        <PageHeaderContainer>Settings - Configurations</PageHeaderContainer>
        <div>
          <Button size="sm">Save</Button>
        </div>
      </div>
      <p className="text-700 lead mb-2">KPI Configurations</p>
      <div className="mt-5 mb-5">
        <div className="row">
          <label className="col-sm-4 col-form-label">
            ROAS score should be higher than:
          </label>
          <div className="col-sm-4">
            <input
              className="form-control outline-none"
              defaultValue={"5.00x"}
            />
          </div>
        </div>
        <div className="row">
          <label className="col-sm-4 col-form-label">
            ACOS score should be lower than:
          </label>
          <div className="col-sm-4">
            <input
              className="form-control outline-none"
              defaultValue={"30.00%"}
            />
          </div>
        </div>
      </div>
      <p className="text-700 lead mb-2">Inventory Status</p>
      <div className="mt-5 mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status Name</TableHead>
              <TableHead>
                Days of Stock
                <br /> (Min)
              </TableHead>
              <TableHead>
                Days if Stock
                <br /> (Max)
              </TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Warn Users</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventorySTatus.map((status, index) => (
              <TableRow key={index}>
                <TableCell className="fw-bold text-1100">
                  {status.name}
                </TableCell>
                <TableCell>{status.dosMin}</TableCell>
                <TableCell>{status.dosMax}</TableCell>
                <TableCell>
                  <span style={{ color: status.color }}>{status.color}</span>
                </TableCell>
                <TableCell>
                  <input type="checkbox" defaultChecked={status.isWarnUsers} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default Configurations;
