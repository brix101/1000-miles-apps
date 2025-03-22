import TableLoader from "@/components/loader/TableLoader";
import CategoryAddModal from "@/components/modals/CategoryAddModal";
import CategoryRemoveModal from "@/components/modals/CategoryRemoveModal";
import CategoryUpdateChildModal from "@/components/modals/CategoryUpdateChildModal";
import CategoryUpdateModal from "@/components/modals/CategoryUpdateModal";
import CategoriesTable from "@/components/tables/CategoryTable";
import { useQueryNestedCategories } from "@/services/category.service";

function Categories() {
  const { data, isLoading } = useQueryNestedCategories();

  return (
    <>
      <div className="g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">Categories</h3>
        </div>
      </div>
      {isLoading ? (
        <TableLoader />
      ) : (
        <CategoriesTable categories={data?.categories ?? []} />
      )}
      <CategoryAddModal />
      <CategoryUpdateModal />
      <CategoryRemoveModal />
      <CategoryUpdateChildModal />
    </>
  );
}

export default Categories;
