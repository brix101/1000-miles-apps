import { Suspense, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from "react-router-dom";

import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import Loader from "@/components/loader/Loader";
import useGetUserCurrent from "@/hooks/queries/useGetUserCurrent";
import { userLoader } from "@/pages/settings/users/UserEdit";
import { useQueryClient } from "@tanstack/react-query";

const Page404 = lazy(() => import("@/pages/Page404"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const CampaignList = lazy(() => import("@/pages/advertising/CampaignList"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const Brands = lazy(() => import("@/pages/listings/Brands"));
const ListingProductList = lazy(
  () => import("@/pages/listings/ListingProductList")
);
const Invetory = lazy(() => import("@/pages/procurement/Invetory"));
const ProcurementProductList = lazy(
  () => import("@/pages/procurement/ProcurementProductList")
);
const Shipments = lazy(() => import("@/pages/procurement/Shipments"));
const Returns = lazy(() => import("@/pages/sales/Returns"));
const Categories = lazy(() => import("@/pages/sales/Categories"));
const Sales = lazy(() => import("@/pages/sales/Sales"));
const Companies = lazy(() => import("@/pages/settings/Companies"));
const Configurations = lazy(() => import("@/pages/settings/Configurations"));
const Marketplaces = lazy(() => import("@/pages/settings/Marketplaces"));
const Users = lazy(() => import("@/pages/settings/users/Users"));
const UserAdd = lazy(() => import("@/pages/settings/users/UserAdd"));
const UserEdit = lazy(() => import("@/pages/settings/users/UserEdit"));

// https://github.com/remix-run/react-router/discussions/10166
function BubbleError() {
  const error = useRouteError();
  if (error) throw error;
  return null;
}

export function BrowserRouter() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetUserCurrent();

  if (isLoading) {
    return <Loader />;
  }

  const router = createBrowserRouter(
    [
      {
        errorElement: <BubbleError />,
        children: [
          {
            element: (
              <Suspense fallback={<Loader />}>
                <SignIn />
              </Suspense>
            ),
            index: true,
          },
          {
            element: data ? (
              <Suspense fallback={<Loader />}>
                <DashboardLayout />
              </Suspense>
            ) : (
              <Navigate to="/" />
            ),
            path: "dashboard",
            children: [
              {
                index: true,
                element: <DashboardPage />,
              },
              {
                path: "listings",
                children: [
                  {
                    index: true,
                    path: "brands",
                    element: <Brands />,
                  },
                  {
                    path: "product-list",
                    element: <ListingProductList />,
                  },
                ],
              },
              {
                path: "procurement",
                children: [
                  {
                    index: true,
                    path: "inventory",
                    element: <Invetory />,
                  },
                  {
                    path: "product-list",
                    element: <ProcurementProductList />,
                  },
                  {
                    path: "shipments",
                    element: <Shipments />,
                  },
                ],
              },
              {
                path: "sales",
                children: [
                  {
                    index: true,
                    element: <Sales />,
                  },
                  {
                    path: "returns",
                    element: <Returns />,
                  },
                  {
                    path: "categories",
                    element: <Categories />,
                  },
                ],
              },
              {
                path: "advertising",
                children: [
                  {
                    index: true,
                    path: "campaign-list",
                    element: <CampaignList />,
                  },
                ],
              },
              {
                path: "settings",
                children: [
                  {
                    path: "users",
                    children: [
                      {
                        index: true,
                        element: <Users />,
                      },
                      {
                        path: "add",
                        element: <UserAdd />,
                      },
                      {
                        path: ":id",
                        loader: userLoader({ queryClient }),
                        element: <UserEdit />,
                      },
                    ],
                  },
                  {
                    path: "marketplaces",
                    element: <Marketplaces />,
                  },
                  {
                    path: "companies",
                    element: <Companies />,
                  },
                  {
                    path: "configurations",
                    element: <Configurations />,
                  },
                ],
              },
              {
                path: "*",
                element: <Page404 />,
              },
            ],
          },
          {
            path: "*",
            element: <Page404 />,
          },
        ],
      },
    ],
    {}
  );
  return <RouterProvider router={router} />;
}
