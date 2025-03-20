import PageHeaderContainer from "@/components/container/page-header-Container";
import DashboardBrandCard from "@/components/dashboard/dashboard-brand-card";
import DashboardCategoryCard from "@/components/dashboard/dashboard-category-card";
import DashboardProductCard from "@/components/dashboard/dashboard-product-card";
import DashboardRefundCards from "@/components/dashboard/dashboard-refund-cards";
import DashboardShipmentCard from "@/components/dashboard/dashboard-shipment-card";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavLink } from "react-router-dom";

function DashboardPage() {
  return (
    <>
      <PageHeaderContainer>Dashboard</PageHeaderContainer>
      <div className="grid-container">
        <DashboardBrandCard />
        <DashboardProductCard />
        <DashboardShipmentCard />
        <DashboardCategoryCard />
        <DashboardRefundCards />

        <Card className="grid-item">
          <CardHeader className="align-items-center justify-content-between">
            <CardTitle>Inventory Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
              <h3 className="fw-bolder text-nowrap text-danger">3</h3>
            </div>
          </CardContent>
          <CardFooter className="custom-card-footer">
            <p className="card-text text-center">
              <NavLink to="procurement/inventory">Go to Inventory</NavLink>
            </p>
          </CardFooter>
        </Card>

        <Card className="grid-item">
          <CardHeader className="align-items-center justify-content-between">
            <CardTitle>Account Heath</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
              <h3 className="fw-bolder text-success">Healthy</h3>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default DashboardPage;
