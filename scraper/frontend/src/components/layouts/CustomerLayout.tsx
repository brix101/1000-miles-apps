import { Icons } from "@/assets/icons";
import { QUERY_EXCLUDED_WORDS_KEY } from "@/constant/query.constant";
import { useQueryCustomer } from "@/services/customer.service";
import { getExcludedWords } from "@/services/exludedWord.service";
import { useQueryClient } from "@tanstack/react-query";
import { Configure } from "react-instantsearch-hooks-web";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import ProductInstasearchContainer from "../container/ProductInstasearchContainer";
import LoadingContent from "../loader/LoadingContent";

function CustomerLayout() {
  const queryClient = useQueryClient();
  const { customerId } = useParams();
  const { pathname } = useLocation();
  const { data, isLoading, error } = useQueryCustomer(customerId ?? "");
  const exludedWordsData = queryClient.getQueryData([QUERY_EXCLUDED_WORDS_KEY]);

  if (!exludedWordsData) {
    queryClient.prefetchQuery({
      queryKey: [QUERY_EXCLUDED_WORDS_KEY],
      queryFn: getExcludedWords,
    });
  }

  if (isLoading) {
    return <LoadingContent />;
  }

  if (error) {
    toast.error("Customer not found");
  }

  const time2WeeksAgo = Math.floor(
    (Date.now() - 14 * 24 * 60 * 60 * 1000) / 1000
  );

  const timeStampFilter = pathname.includes("new-products")
    ? ` AND (timestamp > ${time2WeeksAgo})`
    : "";

  const customerFilter = customerId ? `customer_id:${customerId}` : "";

  const filters = `${customerFilter} ${timeStampFilter}`;
  return (
    <ProductInstasearchContainer>
      <Configure hitsPerPage={100} filters={filters} analytics={true} />
      <header className="mx-n4 mx-lg-n6 px-lg-6 position-relative tab-header">
        <NavLink
          to={`/dashboard/customers/${customerId}/view`}
          end
          className={({ isActive }) => {
            const btnStyle = isActive ? "active" : "btn-primary";
            return `btn btn-sm rounded-0 ${btnStyle}`;
          }}
        >
          <Icons.Ucube height={16} widht={16} />
          Products
        </NavLink>
        <NavLink
          to={`/dashboard/customers/${customerId}/view/analysis`}
          end
          className={({ isActive }) => {
            const btnStyle = isActive ? "active" : "btn-primary";
            return `btn btn-sm rounded-0 ${btnStyle}`;
          }}
        >
          <Icons.InsertChartOutlined height={16} widht={16} /> Analysis
        </NavLink>
        <NavLink
          to={`/dashboard/customers/${customerId}/view/new-products`}
          end
          className={({ isActive }) => {
            const btnStyle = isActive ? "active" : "btn-primary";
            return `btn btn-sm rounded-0 ${btnStyle}`;
          }}
        >
          <Icons.Ucube height={16} widht={16} />
          New Products
        </NavLink>
      </header>
      <div className="mx-n4 mx-lg-n6 px-lg-6 position-relative">
        <nav className="mb-2" aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="#!"></a>
              <NavLink
                to="/dashboard/customers"
                end
                className={({ isActive, isPending }) => {
                  return isActive ? "active" : isPending ? "pending" : "";
                }}
              >
                All Customers
              </NavLink>
            </li>
            <li className="breadcrumb-item active">{data?.name}</li>
          </ol>
        </nav>
        {/* Main Content Here */}
        <Outlet />
      </div>
    </ProductInstasearchContainer>
  );
}

export default CustomerLayout;
