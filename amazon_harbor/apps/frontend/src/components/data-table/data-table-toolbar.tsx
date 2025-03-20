import { Table } from "@tanstack/react-table";

import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  children?: React.ReactNode;
  searchPlaceHolder?: string;
}

export function DataTableToolbar<TData>({
  table,
  children,
  searchPlaceHolder,
}: DataTableToolbarProps<TData>) {
  const globalFilter = table.getState().globalFilter;

  return (
    <div className="row align-items-center justify-content-between g-3 mb-4">
      <div className="col col-auto">{children}</div>
      <div className="col col-auto">
        <div className="search-box">
          <div
            className="position-relative"
            data-bs-toggle="search"
            data-bs-display="static"
          >
            <Input
              className="form-control search-input search"
              type="search"
              aria-label="Search"
              placeholder={searchPlaceHolder ?? "Search ..."}
              value={globalFilter ?? ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                table.setGlobalFilter(event.target.value)
              }
            />
            <Icons.FiSearch
              className="search-box-icon"
              width="13px"
              height="13px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
