import CategoriesAnalysis from "@/components/container/CategoriesAnalysis";
import TagsAnlysis from "@/components/container/TagsAnalysis";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Configure } from "react-instantsearch-hooks";
import { useParams } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CustomerAnalysis() {
  const { customerId } = useParams();

  const customerFilter = customerId ? `customer_id:${customerId}` : "";

  return (
    <>
      <Configure
        hitsPerPage={100}
        facetFilters={[
          customerFilter,
          // "categories.name:Kids",
        ]}
      />
      <div className="row g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">Analysis</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-12 col-xl-6 pb-10 px-1">
          <CategoriesAnalysis />
        </div>
        <div className="col-12 col-lg-12 col-xl-6 pb-10 px-1">
          <TagsAnlysis />
        </div>
      </div>
    </>
  );
}

export default CustomerAnalysis;
