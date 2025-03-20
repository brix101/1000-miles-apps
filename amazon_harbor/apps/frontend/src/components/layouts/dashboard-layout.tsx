import { NavBarTop } from "@/components/layouts/navbar-top";
import { NavBarVertical } from "@/components/layouts/navbar-vertical";
import DashboardLoader from "@/components/loader/DashboardLoader";
import { dashboardConfig } from "@/config/dashboard";
import useBoundStore from "@/hooks/useBoundStore";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  const {
    auth: { user },
  } = useBoundStore();

  const userModules = ["Dashboard"];

  if (user) {
    userModules.push(
      ...(user.allowedModules?.map((module) => module.name) || [])
    );

    if (user.isSuperAdmin) {
      userModules.push("Settings");
    }
  }

  const allowedModules = dashboardConfig.sidebarNav.filter((item) =>
    userModules.includes(item.title)
  );

  return (
    <>
      <NavBarVertical items={allowedModules} />
      <NavBarTop />

      <div className="content">
        <Suspense fallback={<DashboardLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
}

export { DashboardLayout };
