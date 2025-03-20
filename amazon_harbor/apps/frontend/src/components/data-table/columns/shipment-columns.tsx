import { Icons } from "@/components/icons";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useGetShipmentStatuses from "@/hooks/queries/useGetShipmentStatuses";
import { cn } from "@/lib/utils";
import { ShipmentData } from "@/types/shipment";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";

export const shipmentColumns: ColumnDef<ShipmentData>[] = [
  {
    accessorKey: "shipment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      const shipment = original.shipment;
      return (
        <div className="d-flex align-items-center justify-content-between">
          <span className="fw-bold text-1100">{shipment?.ShipmentName}</span>
          <div
            className={cn(
              "me-4",
              original.AllPrepDetailsList.length > 0 ? "visible" : "invisible"
            )}
          >
            <Popover>
              <PopoverTrigger asChild>
                <button className="btn btn-icon">
                  <Icons.UInfoCircle className="text-danger" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="card">
                <ul className="list-group list-group-flush">
                  {original.AllPrepDetailsList.map((item, index) => (
                    <li key={index} className="list-group-item">
                      {item.PrepInstruction}
                    </li>
                  ))}
                </ul>
                <PopoverArrow className="PopoverArrow" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    id: "shipTo",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ship to" />
    ),
    cell: ({ row }) => {
      const shipment = row.original;
      return (
        <span className="text-nowrap">
          {shipment.shipment?.DestinationFulfillmentCenterId}
        </span>
      );
    },
  },
  {
    accessorKey: "SellerSKUs",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKUs" />
    ),
    cell: ({ row }) => {
      const shipment = row.original;
      return <span className="text-nowrap">{shipment.SellerSKUs.length}</span>;
    },
  },
  {
    id: "dateSent",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Sent" />
    ),
    cell: ({ row }) => {
      const shipment = row.original;
      return <span className="text-nowrap">{/* shipment.dateSent */}</span>;
    },
  },
  {
    id: "dateOfArrival",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Arrival" />
    ),
    cell: ({ row }) => {
      const shipment = row.original;
      return (
        <span className="text-nowrap">{/* shipment.dateOfArrival */}</span>
      );
    },
  },
  {
    accessorKey: "Shipped",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number of Units" />
    ),
    cell: ({ row }) => {
      const shipment = row.original;
      return <span className="text-nowrap">{shipment.Shipped}</span>;
    },
  },
  {
    id: "status",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { data, isLoading } = useGetShipmentStatuses();
      const shipment = row.original;
      const shipmentStatus = shipment.shipment?.ShipmentStatus;
      const status =
        data?.find((item) => item.value === shipmentStatus)?.label ||
        shipmentStatus;

      return (
        <span className="text-nowrap">
          {isLoading ? (
            <span className="spinner-border spinner-border-xs"></span>
          ) : (
            <>{status}</>
          )}
        </span>
      );
    },
  },
];
