import { BrandWithMarketplaces, MarkerplaceExtendEntryDTO } from "@repo/schema";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";

export const listingBrandColumns: ColumnDef<BrandWithMarketplaces>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="w-[100px]"
        title="Brand Name"
      />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <h6 className="fw-semi-bold text-uppercase">{name}</h6>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "marketplaces",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marketplaces" />
    ),
    cell: ({ row }) => {
      const marketplaces = row.getValue(
        "marketplaces"
      ) as MarkerplaceExtendEntryDTO[];
      const items = marketplaces.map((item) => item.country).join(", ");

      return <h6 className="fw-semi-bold">{items}</h6>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "noOfProducts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number of Products" />
    ),
    cell: ({ row }) => {
      const brand = row.original;
      const active = brand.activeItemsCount ?? 0;
      const inactive = brand.inactiveItemsCount ?? 0;

      const total = active + inactive;

      return <h6 className="fw-semi-bold">{total}</h6>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "activeItemsCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active Products" />
    ),
    cell: ({ row }) => {
      const count = row.getValue("activeItemsCount") as number | undefined;
      return <h6 className="fw-semi-bold">{count}</h6>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "inactiveItemsCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inactive Products" />
    ),
    cell: ({ row }) => {
      const count = row.getValue("inactiveItemsCount") as number | undefined;
      return <h6 className="fw-semi-bold">{count}</h6>;
    },
    enableHiding: false,
    enableSorting: false,
  },
];
