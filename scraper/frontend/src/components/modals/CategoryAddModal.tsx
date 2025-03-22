import { QUERY_NESTED_CATEGORIES_KEY } from "@/constant/query.constant";
import {
  AddCategoryInput,
  NestedCategoriesEntity,
  addCategorySchema,
  nestedCategorySchema,
} from "@/schema/category.schema";
import { ResponseError } from "@/schema/error.schema";
import { addCategoryMutation } from "@/services/category.service";
import { useBoundStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Inputs } from "../inputs";

function CategoryAddModal() {
  const queryClient = useQueryClient();
  const {
    category: { isAddOpen, setAddOpen },
  } = useBoundStore();

  const { handleSubmit, control, reset } = useForm<AddCategoryInput>({
    resolver: zodResolver(addCategorySchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: addCategoryMutation,
    onSuccess: (response) => {
      handleCloseAddCategory();
      const category = nestedCategorySchema.parse(response.data);
      queryClient.setQueriesData(
        [QUERY_NESTED_CATEGORIES_KEY],
        (prev: unknown) => {
          const { categories } = prev as NestedCategoriesEntity;
          const categoryExists = categories.some(
            (existingCategory) => existingCategory._id === category._id
          );

          if (!categoryExists) {
            const updatedCategories = [category, ...categories];
            toast.success("Category Added");
            return { categories: updatedCategories };
          } else {
            toast.error("Category Already Exists!");
            return prev;
          }
        }
      );
    },
    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;
        console.log(responseError);
      }
    },
  });

  function handleCloseAddCategory() {
    reset({ category: "" });
    setAddOpen(false);
  }

  function onSubmit(values: AddCategoryInput) {
    mutate(values);
  }

  return (
    <>
      <Modal
        show={isAddOpen}
        onHide={handleCloseAddCategory}
        keyboard={false}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body className="row" as="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-10">
            <div className="text-start w-100">
              <Controller
                name="category"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Inputs.Primary
                    placeholder="new category"
                    type="text"
                    {...field}
                    error={error}
                  />
                )}
              />
            </div>
          </div>
          <div className="col-2">
            <button
              className="btn btn-primary float-end w-full white-space-nowrap w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-sm text-light"
                  style={{ height: 14, width: 14 }}
                ></span>
              ) : (
                <>Add</>
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CategoryAddModal;
