import LoadingContent from "@/components/loader/LoadingContent";
import useGetClusterFilter from "@/hooks/useGetClusterFilter";
import { ProductEntity } from "@/schema/product.schema";
import { useQueryCluster } from "@/services/cluster.service";
import { useQueryFacetBatchSearch } from "@/services/facets.service";
import "chart.js/auto";
import { Table } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";

interface IGroupObjects {
  name: string;
  level?: number;
  products: ProductEntity[];
  lowest?: number | null;
  highest?: number | null;
  totalMarkup?: number | null;
}

interface IGroup {
  [key: string]: IGroupObjects;
}

interface SortedCategory extends IGroupObjects {
  label: string;
  count: number;
  currency: string;
}
[];

const categoryOption = {
  id: "category-analysis",
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "CATEGORY",
    },
  },
  parsing: {
    xAxisKey: "label",
    yAxisKey: "count",
  },
  maintainAspectRatio: false,
};

function ClusterAnalysis() {
  const { clusterId, mainCategory } = useParams();
  const { data } = useQueryCluster(clusterId ?? "");
  const queryFilter = useGetClusterFilter(data);

  const { data: hitsResult, isLoading } = useQueryFacetBatchSearch({
    clusterId: clusterId ?? "",
    filters: queryFilter,
  });

  const categoriesGroup: IGroup = hitsResult?.reduce((result, obj) => {
    const productCategories = obj.scraper_categories ?? [];

    const isMainActive = Boolean(
      productCategories
        .find((category) => category.level === 0)
        ?.name.toLowerCase() === mainCategory?.toLowerCase()
    );

    if ((mainCategory && isMainActive) || !mainCategory) {
      productCategories.forEach((ct) => {
        const categoryName = ct["name"].trim();
        const productPrice = obj.price_usd;
        const productMarkup = obj.markup ?? 0;
        const lowest = result[categoryName]?.lowest ?? 0;
        const highest = result[categoryName]?.highest ?? 0;
        const markup = result[categoryName]?.totalMarkup ?? 0;

        if (!result[categoryName]) {
          result[categoryName] = {
            name: categoryName,
            level: ct.level,
            products: [],
            lowest: productPrice,
            highest: productPrice,
            totalMarkup: productMarkup,
          };
        } else {
          if (productPrice && productPrice < lowest) {
            result[categoryName].lowest = productPrice;
          }
          if (productPrice && productPrice > highest) {
            result[categoryName].highest = productPrice;
          }
          result[categoryName].totalMarkup = markup + productMarkup;
        }

        result[categoryName].products.push(obj);
      });
    }

    return result;
  }, {} as IGroup) as IGroup;

  const customersGroup: IGroup = hitsResult?.reduce((result, obj) => {
    const { customer_name, ...rest } = obj;
    const name = customer_name ?? "";

    const isMainActive = Boolean(
      rest.scraper_categories
        ?.find((category) => category.level === 0)
        ?.name.toLowerCase() === mainCategory?.toLowerCase()
    );

    if ((mainCategory && isMainActive) || !mainCategory) {
      if (!result[name]) {
        result[name] = { name, products: [] };
      }
      result[name].products.push(rest);
    }
    return result;
  }, {} as IGroup) as IGroup;

  const categoryData = categoriesGroup
    ? Object.values(categoriesGroup).map((category) => {
        return {
          ...category,
          label: category.name,
          value: category.products.length,
          count: category.products.length,
          markup_percent: 0,
          currency: "$",
        };
      })
    : [];

  const sortedCategoryData: SortedCategory[] = categoryData
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .filter((item) => item.count > 0);

  const categoryLabels = sortedCategoryData.map((item) => item.name);

  const categoriesData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Categories",
        data: sortedCategoryData,
        backgroundColor: "#85A9FF",
      },
    ],
  };

  return (
    <>
      <div className="row g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">{data?.name}</h3>
        </div>
      </div>
      {isLoading ? (
        <LoadingContent />
      ) : (
        <>
          <div className="pb-4">
            <h4 className="text-900 mb-2">
              {mainCategory ? "Sub" : "Main"} Categories
            </h4>
            <div className="analysis-items pb-2 scrollbar-overlay">
              {mainCategory
                ? Object.entries(categoriesGroup)
                    .sort((a, b) => {
                      return a[0].localeCompare(b[0]);
                    })
                    .map(([name, objects]) => {
                      if (objects.level && objects.level > 0) {
                        return <AnalysisCard key={name} objects={objects} />;
                      }
                    })
                : Object.entries(categoriesGroup).map(([name, objects]) => {
                    if (objects.level === 0) {
                      return (
                        <AnalysisCard key={name} objects={objects} clickable />
                      );
                    }
                  })}
            </div>
          </div>

          <div className="row pb-4">
            <div className="col-12 col-lg-6">
              <Bar
                className="card p-2"
                options={categoryOption}
                data={categoriesData}
              />
            </div>
            <div className="col-12 col-lg-6">
              <AnalysisTableContainer data={sortedCategoryData} />
            </div>
          </div>
          <div className="">
            <h4 className="text-900 mb-2">Customers</h4>
            <div className="analysis-items pb-2 scrollbar-overlay">
              {Object.entries(customersGroup).map(([name, objects]) => {
                return <AnalysisCard key={name} objects={objects} />;
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function AnalysisTableContainer({ data }: { data: SortedCategory[] }) {
  data.sort((a, b) => b.count - a.count);

  return (
    <div className="card px-4 py-2">
      <Table responsive className="table table-lg fs--1">
        <thead>
          <tr>
            <th
              className="align-middle text-uppercase"
              style={{ width: "10%" }}
            >
              NAME
            </th>
            <th
              className="align-middle text-uppercase"
              style={{ width: "10%" }}
            >
              # of <br />
              products
            </th>
            <th
              className="align-middle text-uppercase"
              style={{ width: "10%" }}
            >
              Lowest price
            </th>
            <th
              className="align-middle text-uppercase"
              style={{ width: "10%" }}
            >
              highest price
            </th>
            <th
              className="align-middle text-uppercase"
              style={{ width: "10%" }}
            >
              markup
            </th>
          </tr>
        </thead>
        <tbody className="list" id="categories-table-body">
          {data.map((analysis, index) => {
            const totalMarkup = analysis.totalMarkup ?? 0;
            const markup = totalMarkup / analysis.count;

            return (
              <tr key={index} className="position-static">
                <th className="align-middle text-capitalize fs--1 fw-semi-bold text-1000 ">
                  {analysis.label}
                </th>
                <th className="align-middle fs--1 fw-semi-bold text-1000 ">
                  {analysis.count}
                </th>
                <th className="align-middle fs--1 fw-semi-bold text-1000 ">
                  {analysis.currency ?? "$"} {analysis.lowest?.toFixed(2) ?? 0}
                </th>
                <th className="align-middle fs--1 fw-semi-bold text-1000 ">
                  {analysis.currency ?? "$"} {analysis.highest?.toFixed(2) ?? 0}
                </th>
                <th className="align-middle fs--1 fw-semi-bold text-1000 ">
                  {markup?.toFixed(2)}
                </th>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

function AnalysisCard({
  objects,
  clickable,
}: {
  objects: IGroupObjects;
  clickable?: boolean;
}) {
  const { clusterId } = useParams();
  const navigate = useNavigate();

  function handleNavigateClick() {
    if (clickable) {
      navigate(`/dashboard/clusters/${clusterId}/analysis/${objects.name}`);
    }
  }

  return (
    <div
      className="card analysis-item-card border"
      style={{
        minWidth: "240px",
        width: "240px",
        height: "115px",
        cursor: clickable ? "pointer" : "default",
      }}
      onClick={handleNavigateClick}
    >
      <p className="analysis-item-card-label">{objects.name}</p>
      <p className="analysis-item-card-label">
        <span>{objects.products.length}</span> Products
      </p>
    </div>
  );
}

export default ClusterAnalysis;
