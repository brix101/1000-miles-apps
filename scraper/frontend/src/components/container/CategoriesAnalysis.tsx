import "chart.js/auto";
import { Bar } from "react-chartjs-2";

import { useQueryCategoriesScore } from "@/services/product.service";
import { useRefinementList } from "react-instantsearch-hooks";
import AnalysisTableContainer from "./AnalysisTableContainer";

function CategoriesAnalysis() {
  const result = useQueryCategoriesScore();
  const refinementList = useRefinementList({
    attribute: "categories.name",
    limit: 25,
  });

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

  const items = refinementList.items.filter(
    (item) => !["all", "product type"].includes(item.label.toLowerCase())
  );

  const data = items
    .map((item) => {
      const price = result.data?.scores.find(
        (score) => score._id === item.label
      );
      return { ...item, ...price };
    })
    .slice(0, 20);

  const categoryLabels = data.map((item) => item.label);

  const categoriesData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Categories",
        data: data,
        backgroundColor: "#85A9FF",
      },
    ],
  };

  return (
    <>
      <div
        className="mb-2"
        style={{
          height: "50vh",
        }}
      >
        <Bar
          className="card p-2"
          options={categoryOption}
          data={categoriesData}
        />
      </div>
      <AnalysisTableContainer data={data} isLoading={result.isLoading} />
    </>
  );
}

export default CategoriesAnalysis;
