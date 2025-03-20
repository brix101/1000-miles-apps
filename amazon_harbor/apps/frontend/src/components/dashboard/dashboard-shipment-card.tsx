import useGetShipments from "@/hooks/queries/useGetShipments";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function DashboardShipmentCard() {
  const { data, isLoading } = useGetShipments({ status: "ALL" });

  const onGoingShipment =
    data?.filter(
      (item) =>
        !["CLOSED", "CANCELLED"].includes(item.shipment?.ShipmentStatus || "")
    ) || [];

  return (
    <Card className="grid-item">
      <CardHeader className="align-items-center justify-content-between">
        <CardTitle>Ongoing Shipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
          <>
            {isLoading ? (
              <span className="placeholder placeholder-dashboard m-1 w-25 rounded-2" />
            ) : (
              <h3 className="fw-bolder text-nowrap ">
                {onGoingShipment?.length}
              </h3>
            )}
          </>
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardShipmentCard;
