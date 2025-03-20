import { MarketPlaceWithBrand } from "@repo/schema";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";

export const marketplaceColumns: ColumnDef<MarketPlaceWithBrand>[] = [
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const country = row.getValue("country") as string;
      return <h6 className="fw-bold text-1100">{country}</h6>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "sellersAccounts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sellers Account" />
    ),
    cell: ({ row }) => {
      const sellersAccount = row.getValue("sellersAccounts") as Array<string>;
      return <span>{sellersAccount?.join(", ")}</span>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "brands",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brands" />
    ),
    cell: ({ row }) => {
      const brands = row.getValue("brands") as string[];
      const items = brands.join(", ");

      return <span className="text-uppercase">{items}</span>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "activeItemsCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number of Products" />
    ),
    cell: ({ row }) => {
      const marketplace = row.original;
      const total =
        (marketplace.activeItemsCount ?? 0) +
        (marketplace.inactiveItemsCount ?? 0);

      return (
        <span>
          {total} ({marketplace.activeItemsCount} Active)
        </span>
      );
    },
    enableHiding: false,
  },
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="SP-API-KEY" />
  //   ),
  //   cell: ({ row }) => {
  //     return <span></span>;
  //   },
  //   enableHiding: false,
  //   enableSorting: false,
  // },
];
