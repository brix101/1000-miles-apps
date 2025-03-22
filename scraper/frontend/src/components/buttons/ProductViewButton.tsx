import { Icons } from "@/assets/icons";
import { useBoundStore } from "@/store";

function ProductViewButton() {
  const {
    product: { viewStyle },
    setViewState,
  } = useBoundStore();
  const isList = viewStyle === "list";
  const isGrid = viewStyle === "grid";

  return (
    <div className="d-flex">
      <button
        className={`btn btn-icon btn-phoenix-primary btn-md me-1 ${
          isList ? "active" : ""
        }`}
        onClick={() => setViewState("list")}
      >
        <Icons.FiList height={20} width={20} />
      </button>
      <button
        className={`btn btn-icon btn-phoenix-primary btn-md me-1 ${
          isGrid ? "active" : ""
        }`}
        onClick={() => setViewState("grid")}
      >
        <Icons.FiGrid height={20} width={20} />
      </button>
    </div>
  );
}

export default ProductViewButton;
