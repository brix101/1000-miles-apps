import CategoriesAnalysis from "@/components/container/CategoriesAnalysis";
import TagsAnlysis from "@/components/container/TagsAnalysis";

function ProductAnalysis() {
  return (
    <>
      <div className="row g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">Analysis</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-12 col-xl-6 pb-10  px-1">
          <CategoriesAnalysis />
        </div>
        <div className="col-12 col-lg-12 col-xl-6 pb-10  px-1">
          <TagsAnlysis />
        </div>
      </div>
    </>
  );
}

export default ProductAnalysis;
