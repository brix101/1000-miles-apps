import { QUERY_CUSTOMERS_KEY } from "@/constant/query.constant";
import { getCustomers } from "@/services/customer.service";
import { useBoundStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense, lazy, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Sidebar = lazy(() => import("@/components/Sidebar"));
const TopBar = lazy(() => import("@/components/TopBar"));

function DashboardLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken, user } = useBoundStore((state) => state.auth);

  const customersData = queryClient.getQueryData([QUERY_CUSTOMERS_KEY]);

  useEffect(() => {
    if (!user && !accessToken) {
      navigate("/", { replace: true });
    }
  }, [user, accessToken, navigate]);

  if (!customersData) {
    queryClient.prefetchQuery({
      queryKey: [QUERY_CUSTOMERS_KEY],
      queryFn: getCustomers,
    });
  }

  return (
    <main className="main" id="top">
      <Suspense
        fallback={
          <div className="navbar navbar-vertical navbar-expand-lg"></div>
        }
      >
        <Sidebar />
      </Suspense>
      <Suspense
        fallback={
          <div className="navbar navbar-top fixed-top navbar-expand"></div>
        }
      >
        <TopBar />
      </Suspense>
      <div className="content">
        <Outlet />
      </div>
    </main>
  );
}

export default DashboardLayout;
