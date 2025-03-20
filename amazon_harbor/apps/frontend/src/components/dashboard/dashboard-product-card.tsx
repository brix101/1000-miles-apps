import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetListings from "@/hooks/queries/useGetListings";

function DashboardProductCard() {
  const { data, isLoading } = useGetListings();

  const active = data?.filter((item) => item.status === "Active");
  return (
    <Card className="grid-item placeholder-glow">
      <CardHeader className="align-items-center justify-content-between">
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
          <>
            {isLoading ? (
              <span className="placeholder placeholder-dashboard m-1 w-25 rounded-2" />
            ) : (
              <h3 className="fw-bolder text-nowrap ">{data?.length}</h3>
            )}
          </>
        </div>
      </CardContent>
      <CardFooter className="custom-card-footer">
        <p className="card-text text-center">
          <>
            {isLoading ? (
              <span className="placeholder w-25 rounded-2" />
            ) : (
              <span className="text-success">{active?.length} Active</span>
            )}
          </>
        </p>
      </CardFooter>
    </Card>
  );
}

export default DashboardProductCard;
