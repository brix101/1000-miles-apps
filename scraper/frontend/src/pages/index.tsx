/* eslint-disable react-refresh/only-export-components */
import React, { Suspense } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";

import ClusterLayout from "@/components/layouts/ClusterLayout";
import LoadingContent from "@/components/loader/LoadingContent";
import TableContentLoader from "@/components/loader/TableContentLoader";
import EditCustomer from "@/pages/customer/EditCustomer";
import { fetchCurrentUser } from "@/services/user.service";
import Page404 from "./Page404";
import Page500 from "./Page500";

const DashboardLayout = React.lazy(
  () => import("@/components/layouts/DashboardLayout")
);
const CustomerLayout = React.lazy(
  () => import("@/components/layouts/CustomerLayout")
);
const NewProductLayout = React.lazy(
  () => import("@/components/layouts/NewProductLayout")
);
const ConfigLayout = React.lazy(
  () => import("@/components/layouts/ConfigLayout")
);

const ProductInstasearchContainer = React.lazy(
  () => import("@/components/container/ProductInstasearchContainer")
);

const SignIn = React.lazy(() => import("@/pages/SignIn"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));

const Clusters = React.lazy(() => import("@/pages/cluster/Clusters"));
const ClusterProduct = React.lazy(
  () => import("@/pages/cluster/ClusterProduct")
);
const ClusterAnalysis = React.lazy(
  () => import("@/pages/cluster/ClusterAnalysis")
);
const ClusterNewProduct = React.lazy(
  () => import("@/pages/cluster/ClusterNewProduct")
);
const ClusterTimeline = React.lazy(
  () => import("@/pages/cluster/ClusterTimeline")
);

const AddNewCustomer = React.lazy(
  () => import("@/pages/customer/AddNewCustomer")
);
const CustomerAnalysis = React.lazy(
  () => import("@/pages/customer/CustomerAnalysis")
);
const CustomerProducts = React.lazy(
  () => import("@/pages/customer/CustomerProducts")
);
const Customer = React.lazy(() => import("@/pages/customer/Customers"));

const NewProducts = React.lazy(() => import("@/pages/product/NewProducts"));
const ProductAnalysis = React.lazy(
  () => import("@/pages/product/ProductAnalysis")
);
const Products = React.lazy(() => import("@/pages/product/Products"));

const SynonymsPlurals = React.lazy(
  () => import("@/pages/settings/SynonymsPlurals")
);
const Translations = React.lazy(() => import("@/pages/settings/Translations"));
const NewUser = React.lazy(() => import("@/pages/settings/users/NewUser"));
const User = React.lazy(() => import("@/pages/settings/users/User"));
const Users = React.lazy(() => import("@/pages/settings/users/Users"));
const ExcludedWords = React.lazy(
  () => import("@/pages/settings/ExcludedWords")
);
const Categories = React.lazy(() => import("@/pages/settings/Categories"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingContent />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    errorElement: <Page500 />,
    loader: async () => {
      const user = await fetchCurrentUser();
      return user;
    },
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingContent />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "clusters",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingContent />}>
                <Clusters />
              </Suspense>
            ),
          },
          {
            path: ":clusterId",
            element: (
              <Suspense fallback={<LoadingContent />}>
                <ClusterLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<LoadingContent />}>
                    <ClusterProduct />
                  </Suspense>
                ),
              },
              {
                path: "analysis",
                element: (
                  <Suspense fallback={<LoadingContent />}>
                    <ClusterAnalysis />
                  </Suspense>
                ),
              },
              {
                path: "analysis/:mainCategory",
                element: (
                  <Suspense fallback={<LoadingContent />}>
                    <ClusterAnalysis />
                  </Suspense>
                ),
              },
              {
                path: "new-products",
                element: (
                  <Suspense fallback={<LoadingContent />}>
                    <ClusterNewProduct />
                  </Suspense>
                ),
              },
              {
                path: "timeline",
                element: (
                  <Suspense fallback={<LoadingContent />}>
                    <ClusterTimeline />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "customers",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<TableContentLoader />}>
                <Customer />
              </Suspense>
            ),
          },
          {
            path: ":customerId/view",
            element: (
              <Suspense fallback={<LoadingContent />}>
                <CustomerLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<LoadingContent />}>
                    <CustomerProducts />
                  </Suspense>
                ),
              },
              {
                path: "analysis",
                element: (
                  <Suspense fallback={<LoadingContent />}>
                    <CustomerAnalysis />
                  </Suspense>
                ),
              },
              {
                path: "new-products",
                element: (
                  <Suspense fallback={<LoadingContent />}>
                    <NewProducts />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<LoadingContent />}>
            <ProductInstasearchContainer>
              <Outlet />
            </ProductInstasearchContainer>
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingContent />}>
                <Products />
              </Suspense>
            ),
          },
          {
            path: "new",
            element: (
              <Suspense fallback={<LoadingContent />}>
                <NewProductLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<LoadingContent />}>
                    <NewProducts />
                  </Suspense>
                ),
              },
              {
                path: "analysis",
                element: (
                  <Suspense fallback={<LoadingContent />}>
                    <ProductAnalysis />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      // Protected Routes
      {
        path: "",
        element: (
          <Suspense fallback={<LoadingContent />}>
            <ConfigLayout />
          </Suspense>
        ),
        children: [
          {
            path: "customers/:customerId/edit",
            element: (
              <Suspense fallback={<LoadingContent />}>
                <EditCustomer />
              </Suspense>
            ),
          },
          {
            path: "customers-new",
            element: (
              <Suspense fallback={<LoadingContent />}>
                <AddNewCustomer />
              </Suspense>
            ),
          },
          {
            path: "users",
            element: (
              <Suspense fallback={<TableContentLoader />}>
                <Outlet />
              </Suspense>
            ),
            children: [
              { index: true, element: <Users /> },
              { path: ":userId/:viewType", element: <User /> },
              { path: "new", element: <NewUser /> },
            ],
          },
          {
            path: "synonyms-plurals",
            element: (
              <Suspense fallback={<TableContentLoader />}>
                <SynonymsPlurals />
              </Suspense>
            ),
          },
          {
            path: "translations",
            element: (
              <Suspense fallback={<LoadingContent />}>
                <Translations />
              </Suspense>
            ),
          },
          {
            path: "tags",
            element: (
              <Suspense fallback={<LoadingContent />}>
                <ExcludedWords />
              </Suspense>
            ),
          },
          {
            path: "categories",
            element: (
              <Suspense fallback={<LoadingContent />}>
                <Categories />
              </Suspense>
            ),
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
]);

export default router;
