import { Company } from "@repo/schema";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <h6 className="fw-semi-bold">{name}</h6>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      return (
        <div className="">
          <input type="checkbox" defaultChecked={active} />
        </div>
      );
    },
  },
];
