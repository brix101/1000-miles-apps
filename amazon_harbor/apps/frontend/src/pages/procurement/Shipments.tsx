import PageHeaderContainer from "@/components/container/page-header-Container";
import { shipmentColumns } from "@/components/data-table/columns/shipment-columns";
import { DataTable } from "@/components/data-table/data-table";
import ShipmentStatusSearchSelect from "@/components/search-select/shipment-status-search-select";
import useGetShipments from "@/hooks/queries/useGetShipments";
import { useSearchParams } from "react-router-dom";

function Shipments() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") ?? "ALL";

  const { data, isLoading, isFetching } = useGetShipments({ status });

  return (
    <>
      <PageHeaderContainer>Shipments</PageHeaderContainer>
      <div className="row">
        <div className="col-4">
          <ShipmentStatusSearchSelect />
        </div>
      </div>
      <div id="procurement-products">
        <DataTable
          data={data ?? []}
          columns={shipmentColumns}
          isLoading={isLoading || isFetching}
          enableToolbar={false}
        />
      </div>
    </>
  );
}

export default Shipments;
