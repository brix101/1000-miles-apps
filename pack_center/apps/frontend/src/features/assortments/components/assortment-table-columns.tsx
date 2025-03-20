import { ColumnDef } from '@tanstack/react-table';
import { NavLink } from 'react-router-dom';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getStatusVariant } from '@/utils/getStatusVariant';
import { getUploadStatus } from '@/utils/getUploadStatus';
import { Assortment } from '..';

export const assortmentTableColumns: ColumnDef<Assortment>[] = [
  {
    accessorKey: 'customerItemNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Item No." />
    ),
    cell: ({ row }) => {
      const original = row.original;

      const name = row.getValue('customerItemNo') as string;
      return (
        <NavLink
          className="d-flex align-items-center text-900 text-hover-1000"
          to={`${original._id}`}
        >
          <h6 className="mb-0 ms-3 fw-semi-bold text-capitalize">{name}</h6>
        </NavLink>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'itemNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assortment No." />
    ),
    cell: ({ row }) => {
      const itemNo = row.getValue('itemNo') as string;
      return <>{itemNo}</>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const po = row.getValue('name') as string;
      return <>{po}</>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      return (
        <Badge className="text-capitalize" variant={getStatusVariant(status)}>
          {status}
        </Badge>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: 'uploadStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Upload Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('uploadStatus') as string;

      const UStatus = getUploadStatus(status);
      return (
        <>
          <UStatus
            className={cn(
              'text-400',
              status === 'completed' && 'text-success',
              status === 'in-progress' && 'text-info',
            )}
          />
        </>
      );
    },
    enableHiding: false,
  },
];
