import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import React, { ForwardedRef, MouseEvent, ReactNode } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Icons } from "../icons";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

interface CustomToggleProps {
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
  children?: ReactNode;
}

const CustomToggle = React.forwardRef(
  (
    { onClick, children }: CustomToggleProps,
    ref: ForwardedRef<HTMLAnchorElement>
  ) => (
    <a
      href=""
      ref={ref}
      className="text-secondary d-flex align-items-center"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  )
);

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const canHide = false; //column.getCanHide();
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("d-flex justify-items-center", className)}>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle}>
          <span>{title}</span>
          {column.getIsSorted() === "desc" ? (
            <Icons.FiChevronDown height={16} />
          ) : column.getIsSorted() === "asc" ? (
            <Icons.FiChevronUp height={16} />
          ) : (
            <Icons.UChevronUpDown height={16} />
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => column.toggleSorting(false)}>
            <Icons.FiChevronUp height={16} />
            Asc
          </Dropdown.Item>
          <Dropdown.Item onClick={() => column.toggleSorting(true)}>
            <Icons.FiChevronDown height={16} />
            Desc
          </Dropdown.Item>
          {canHide ? (
            <>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => column.toggleVisibility(false)}>
                <Icons.FiEyeOff height={16} />
                Hide
              </Dropdown.Item>
            </>
          ) : undefined}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
