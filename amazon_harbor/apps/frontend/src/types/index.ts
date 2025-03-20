import { Icons } from "@/components/icons";
import { QueryClient } from "@tanstack/react-query";
import { NavLinkProps } from "react-router-dom";

export interface NavItem extends NavLinkProps {
  title: string;
  disabled?: boolean;
  visible?: boolean;
  parent?: boolean;
  icon?: keyof typeof Icons;
  info?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export type SidebarNavItem = NavItemWithChildren;

export type LoaderType = { queryClient: QueryClient };

export interface Dimension {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
