import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSearchParams } from "react-router-dom";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  searchPlaceHolder?: string;
  toolBarChildren?: React.ReactNode;
  enableToolbar?: boolean;
  enableTablePagination?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  searchPlaceHolder,
  toolBarChildren,
  enableToolbar,
  enableTablePagination,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const globalFilter = searchParams.get("filter");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onGlobalFilterChange: (filter) => {
      searchParams.set("filter", filter);
      setSearchParams(filter ? searchParams : undefined);
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const hasContainsFooter = table
    .getFooterGroups()
    .flat()
    .some((item) =>
      item.headers.some((header) => header.column.columnDef.footer)
    );

  return (
    <>
      {enableToolbar !== false && (
        <DataTableToolbar
          table={table}
          children={toolBarChildren}
          searchPlaceHolder={searchPlaceHolder}
        />
      )}

      <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <>
                {isLoading ? (
                  <>
                    {Array.from({ length: 5 }, (_, index) => (
                      <TableRow key={index} className="placeholder-glow">
                        {Array.from(
                          { length: columns.length },
                          (_, columnIndex) => (
                            <TableCell key={columnIndex}>
                              <span
                                className="placeholder w-100 rounded-2"
                                style={{ height: "30px" }}
                              ></span>
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="display-1 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
          {hasContainsFooter && (
            <TableFooter className="border-top border-bottom border-dark">
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableCell key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          )}
        </Table>

        {enableTablePagination !== false && (
          <DataTablePagination table={table} />
        )}
      </div>
    </>
  );
}
