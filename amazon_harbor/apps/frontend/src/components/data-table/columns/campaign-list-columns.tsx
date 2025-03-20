import { getCurrencySymbol } from "@/lib/utils";
import { AdSponsoredProduct } from "@repo/schema";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { DataTableColumnHeader } from "../data-table-column-header";

export const campaignListColumns: ColumnDef<AdSponsoredProduct>[] = [
  {
    accessorKey: "campaignName",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campaign Name" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return (
        <span className="text-nowrap fw-bold text-1100">
          {original.campaignName}
        </span>
      );
    },
  },
  {
    accessorKey: "portfolio",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Portfolio" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return <span className="text-nowrap">{original.portfolio ?? ""}</span>;
    },
  },
  {
    accessorKey: "campaignStatus",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return <span className="text-nowrap">{original.campaignStatus}</span>;
    },
  },
  {
    accessorKey: "startDate",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Date start"
        className="text-nowrap"
      />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return (
        <span className="text-nowrap">
          {dayjs(original.startDate).format("MMM-DD, YYYY")}
        </span>
      );
    },
  },
  {
    accessorKey: "endDate",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Date end"
        className="text-nowrap"
      />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return (
        <span className="text-nowrap">
          {dayjs(original.endDate).format("MMM-DD, YYYY")}
        </span>
      );
    },
  },
  {
    accessorKey: "costPerClick",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPC" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      const currCode = getCurrencySymbol(original.campaignBudgetCurrencyCode);
      return (
        <span className="text-nowrap">
          {currCode} {original.costPerClick?.toFixed(2) || "0.00"}
        </span>
      );
    },
    footer: ({ table }) => {
      const filteredModel = table.getFilteredRowModel();
      const total = filteredModel.rows
        .reduce((total, row) => total + (row.original.costPerClick || 0), 0)
        .toFixed(2);

      const currCode = getCurrencySymbol(
        filteredModel.rows[0]?.original.campaignBudgetCurrencyCode,
      );
      return (
        <span className="text-nowrap fw-bold text-1100">
          {currCode} {total}
        </span>
      );
    },
  },
  {
    accessorKey: "campaignBudgetAmount",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Budget" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      const currCode = getCurrencySymbol(original.campaignBudgetCurrencyCode);
      return (
        <span className="text-nowrap">
          {currCode} {original.campaignBudgetAmount}
        </span>
      );
    },
    footer: ({ table }) => {
      const filteredModel = table.getFilteredRowModel();
      const total = filteredModel.rows
        .reduce(
          (total, row) => total + (row.original.campaignBudgetAmount || 0),
          0,
        )
        .toFixed(2);

      const currCode = getCurrencySymbol(
        filteredModel.rows[0]?.original.campaignBudgetCurrencyCode,
      );
      return (
        <span className="text-nowrap fw-bold text-1100">
          {currCode} {total}
        </span>
      );
    },
  },
  {
    accessorKey: "clicks",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Clicks" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return <span className="text-nowrap">{original.clicks}</span>;
    },
    footer: ({ table }) => {
      const filteredModel = table.getFilteredRowModel();
      const total = filteredModel.rows.reduce(
        (total, row) => total + (row.original.clicks || 0),
        0,
      );
      return <span className="text-nowrap fw-bold text-1100">{total}</span>;
    },
  },
  {
    accessorKey: "unitsSoldClicks1d",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Units Sold" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return <span className="text-nowrap">{original.unitsSoldClicks1d}</span>;
    },
    footer: ({ table }) => {
      const filteredModel = table.getFilteredRowModel();
      const total = filteredModel.rows.reduce(
        (total, row) => total + row.original.unitsSoldClicks1d,
        0,
      );
      return <span className="text-nowrap fw-bold text-1100">{total}</span>;
    },
  },
  {
    accessorKey: "spend",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Spent" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      const currCode = getCurrencySymbol(original.campaignBudgetCurrencyCode);
      return (
        <span className="text-nowrap">
          {currCode} {original.spend.toFixed(2)}
        </span>
      );
    },
    footer: ({ table }) => {
      const filteredModel = table.getFilteredRowModel();
      const total = filteredModel.rows
        .reduce((total, row) => total + row.original.spend, 0)
        .toFixed(2);

      const currCode = getCurrencySymbol(
        filteredModel.rows[0]?.original.campaignBudgetCurrencyCode,
      );
      return (
        <span className="text-nowrap fw-bold text-1100">
          {currCode} {total}
        </span>
      );
    },
  },
  {
    accessorKey: "sales1d",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sales" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      const currCode = getCurrencySymbol(original.campaignBudgetCurrencyCode);
      return (
        <span className="text-nowrap">
          {currCode} {original.sales1d.toFixed(2)}
        </span>
      );
    },
    footer: ({ table }) => {
      const filteredModel = table.getFilteredRowModel();
      const total = filteredModel.rows
        .reduce((total, row) => total + row.original.sales1d, 0)
        .toFixed(2);

      const currCode = getCurrencySymbol(
        filteredModel.rows[0]?.original.campaignBudgetCurrencyCode,
      );
      return (
        <span className="text-nowrap fw-bold text-1100">
          {currCode} {total}
        </span>
      );
    },
  },
  {
    accessorKey: "impressions",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Impressions" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return <span className="text-nowrap">{original.impressions}</span>;
    },
    footer: ({ table }) => {
      const filteredModel = table.getFilteredRowModel();
      const total = filteredModel.rows.reduce(
        (total, row) => total + row.original.impressions,
        0,
      );
      return <span className="text-nowrap fw-bold text-1100">{total}</span>;
    },
  },
  {
    id: "acosClicks7d",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ACOS" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return (
        <span className="text-nowrap">
          {original.acosClicks7d?.toFixed(2) || "0.00"}
        </span>
      );
    },
    footer: ({ table }) => {
      const filteredModel = table.getFilteredRowModel();
      const total = filteredModel.rows
        .reduce((total, row) => total + (row.original.acosClicks7d || 0), 0)
        .toFixed(2);
      return <span className="text-nowrap fw-bold text-1100">{total}</span>;
    },
  },
  {
    id: "roas",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ROAS" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return (
        <span className="text-nowrap">
          {original.roasClicks7d?.toFixed(2) || "0.00"}
        </span>
      );
    },
    footer: ({ table }) => {
      const filteredModel = table.getFilteredRowModel();
      const total = filteredModel.rows
        .reduce((total, row) => total + (row.original.roasClicks7d || 0), 0)
        .toFixed(2);
      return <span className="text-nowrap fw-bold text-1100">{total}</span>;
    },
  },
];
