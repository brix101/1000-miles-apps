import { useQueryExcludedWords } from "@/services/exludedWord.service";
import { useQueryTagsScore } from "@/services/product.service";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useRefinementList } from "react-instantsearch-hooks";
import AnalysisTableContainer from "./AnalysisTableContainer";

function TagsAnlysis() {
  const { data: wordsData } = useQueryExcludedWords();
  const result = useQueryTagsScore();
  const refinementList = useRefinementList({
    attribute: "tags",
    limit: 25,
  });

  const tagsOption = {
    id: "zxcv",
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "TAGS",
      },
    },
    parsing: {
      xAxisKey: "label",
      yAxisKey: "count",
    },
    maintainAspectRatio: false,
  };

  const items = refinementList.items.filter(
    (item) =>
      !wordsData?.words.find((word) =>
        word.word?.includes(item.label.toLowerCase())
      )
  );

  const data = items
    .map((item) => {
      const price = result.data?.scores.find(
        (score) => score._id === item.label
      );
      return { ...item, ...price };
    })
    .slice(0, 20);

  const tagLabels = data.map((item) => item.label);

  const tagsData = {
    labels: tagLabels,
    datasets: [
      {
        label: "Tags",
        data: items,
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
        <Bar className="card p-2" options={tagsOption} data={tagsData} />
      </div>
      <AnalysisTableContainer data={data} isLoading={result.isLoading} />
    </>
  );
}

export default TagsAnlysis;
