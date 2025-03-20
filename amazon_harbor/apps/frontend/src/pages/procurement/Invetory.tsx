import PageHeaderContainer from "@/components/container/page-header-Container";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetIssues from "@/hooks/queries/useGetIssues";
import { NavLink } from "react-router-dom";

function Invetory() {
  const { data: issues } = useGetIssues();
  return (
    <>
      <PageHeaderContainer>Invetory</PageHeaderContainer>

      <p className="text-700 lead mb-2">Overview</p>
      <div className="grid-container">
        <Card className="grid-item">
          <CardHeader className="align-items-center justify-content-between">
            <CardTitle>Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
              <h3 className="fw-bolder text-nowrap text-danger">3</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="grid-item">
          <CardHeader className="align-items-center justify-content-between">
            <CardTitle>Units Sold this Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
              <h3 className="fw-bolder text-nowrap text-success">125</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="grid-item">
          <CardHeader className="align-items-center justify-content-between">
            <CardTitle>Amazon Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
              <h3 className="fw-bolder text-nowrap text-success">55% Full</h3>
            </div>
          </CardContent>
          <CardFooter className="custom-card-footer">
            <p className="card-text text-center">375.01 out of 750 CUFT</p>
          </CardFooter>
        </Card>

        <Card className="grid-item">
          <CardHeader className="align-items-center justify-content-between">
            <CardTitle>YIWU Wharehouse stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
              <h3 className="fw-bolder text-nowrap text-success ">1250</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-700 lead mb-2">Issues</p>
      <div className="mt-5 mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Issue Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue, index) => (
              <TableRow key={index}>
                <TableCell className="fw-bold text-1100">
                  {issue.issueType}
                </TableCell>
                <TableCell className="text-1100">{issue.description}</TableCell>
                <TableCell>
                  <NavLink className="fw-semi-bold" to={issue.link}>
                    Resolve Problem
                  </NavLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default Invetory;
