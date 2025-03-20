import useGetBrands from "@/hooks/queries/useGetBrands";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function DashboardBrandCard() {
  const { data, isLoading } = useGetBrands();

  return (
    <Card className="grid-item placeholder-glow">
      <CardHeader className="align-items-center justify-content-between">
        <CardTitle>Brands</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="d-flex flex-column align-items-center justify-content-between text-nowrap">
          <>
            {isLoading ? (
              <span className="placeholder placeholder-dashboard m-1 w-25 rounded-2" />
            ) : (
              <h3 className="fw-bolder text-nowrap ">{data?.length}</h3>
            )}
          </>
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardBrandCard;
