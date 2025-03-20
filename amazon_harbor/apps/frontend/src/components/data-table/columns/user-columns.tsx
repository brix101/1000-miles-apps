import AvatarContainer from "@/components/container/avatar-container";
import UserDeleteForm from "@/components/forms/UserDeleteForm";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { QUERY_USERS_KEY } from "@/contant/query.contant";
import useBoundStore from "@/hooks/useBoundStore";
import { Module, User } from "@repo/schema";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";
import { DataTableColumnHeader } from "../data-table-column-header";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      const id = original._id;

      const name = row.getValue("name") as string;
      return (
        <NavLink
          className="d-flex align-items-center text-900 text-hover-1000"
          to={id}
        >
          <div className="avatar avatar-m">
            <AvatarContainer name={name} />
          </div>
          <h6 className="mb-0 ms-3 fw-semi-bold text-capitalize">{name}</h6>
        </NavLink>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <span className="fw-semi-bold">{email}</span>;
    },
  },
  {
    accessorKey: "isSuperAdmin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Super Admin" />
    ),
    cell: ({ row }) => {
      const isSuperAdmin = row.getValue("isSuperAdmin") as boolean;
      return (
        <div className="">
          <input type="checkbox" checked={isSuperAdmin} readOnly />
        </div>
      );
    },
  },
  {
    accessorKey: "allowedModules",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Allowed Module" />
    ),
    cell: ({ row }) => {
      const modules = row.getValue("allowedModules") as Module[];
      return <span>{modules.map((module) => module.name).join(", ")}</span>;
    },
  },
  {
    id: "action",
    header: () => <span>Edit</span>,
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const { setDialogItem } = useBoundStore();
      const original = row.original;
      const id = original._id;

      function handleEditClick() {
        queryClient.setQueryData([QUERY_USERS_KEY, id], original);
      }

      function handleDeleteClick() {
        setDialogItem({
          item: <UserDeleteForm user={original} />,
        });
      }

      return (
        <div className="d-flex">
          <NavLink
            className="btn btn-link btn-icon text-success"
            to={id}
            onClick={handleEditClick}
          >
            <Icons.UEdit />
          </NavLink>
          <Button
            variant="link"
            size="icon"
            className="text-danger"
            onClick={handleDeleteClick}
          >
            <Icons.UTrashAlt />
          </Button>
        </div>
      );
    },
  },
];
