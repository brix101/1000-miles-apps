import { Icons } from "@/assets/icons";
import { QUERY_EXCLUDED_WORDS_KEY } from "@/constant/query.constant";
import { getExcludedWords } from "@/services/exludedWord.service";
import { useQueryClient } from "@tanstack/react-query";
import { Configure } from "react-instantsearch-hooks-web";
import { NavLink, Outlet } from "react-router-dom";

function NewProductLayout() {
  const queryClient = useQueryClient();

  const exludedWordsData = queryClient.getQueryData([QUERY_EXCLUDED_WORDS_KEY]);

  if (!exludedWordsData) {
    queryClient.prefetchQuery({
      queryKey: [QUERY_EXCLUDED_WORDS_KEY],
      queryFn: getExcludedWords,
    });
  }
  const time2WeeksAgo = Math.floor(
    (Date.now() - 14 * 24 * 60 * 60 * 1000) / 1000
  );

  const timeStampFilter = `timestamp > ${time2WeeksAgo}`;

  return (
    <>
      <Configure hitsPerPage={100} filters={timeStampFilter} analytics={true} />
      <header className="mx-n4 mx-lg-n6 px-lg-6 position-relative tab-header">
        <NavLink
          to={`/dashboard/products/new`}
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
          to={`/dashboard/products/new/analysis`}
          className={({ isActive }) => {
            const btnStyle = isActive ? "active" : "btn-primary";
            return `btn btn-sm rounded-0 ${btnStyle}`;
          }}
        >
          <Icons.InsertChartOutlined height={16} widht={16} /> Analysis
        </NavLink>
      </header>
      <div className="mx-n4 mx-lg-n6 px-lg-6 position-relative">
        {/* Main Content Here */}
        <Outlet />
      </div>
    </>
  );
}

export default NewProductLayout;
