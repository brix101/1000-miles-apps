import { type SidebarNavItem } from "@/types";

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[];
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Dashboard",
      icon: "MaDashboard",
      to: "/dashboard",
      parent: true,
      items: [],
    },
    {
      title: "Listings",
      icon: "MaAssignment",
      to: "/dashboard/listings",
      parent: true,
      items: [
        { title: "Brands", to: "brands", items: [] },
        { title: "Product List", to: "product-list", items: [] },
      ],
    },
    {
      title: "Procurement",
      icon: "FiArchived",
      to: "/dashboard/procurement",
      parent: true,
      items: [
        { title: "Inventory", to: "inventory", items: [] },
        { title: "Product List", to: "product-list", items: [] },
        { title: "Shipments", to: "shipments", items: [] },
      ],
    },
    {
      title: "Sales",
      icon: "UAssesment",
      to: "/dashboard/sales",
      parent: true,
      items: [
        { title: "Sales", to: "", items: [] },
        { title: "Returns", to: "returns", items: [] },
        { title: "Categories", to: "categories", items: [] },
      ],
    },
    {
      title: "Advertising",
      icon: "UOfflineBolt",
      to: "/dashboard/advertising",
      parent: true,
      items: [{ title: "Campaign List", to: "campaign-list", items: [] }],
    },
    {
      title: "Settings",
      icon: "MaSettings",
      to: "/dashboard/settings",
      parent: true,
      items: [
        { title: "Users", to: "users", items: [] },
        { title: "Marketplaces", to: "marketplaces", items: [] },
        { title: "Companies", to: "companies", items: [] },
        { title: "Configurations", to: "configurations", items: [] },
      ],
    },
  ],
};
