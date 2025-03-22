import { QUERY_NESTED_CATEGORIES_KEY } from "@/constant/query.constant";
import {
  NestedCategoriesEntity,
  UpdateCategoryInput,
  nestedCategorySchema,
  updateCategorySchema,
} from "@/schema/category.schema";
import { ResponseError } from "@/schema/error.schema";
import { updateCategoryMutation } from "@/services/category.service";
import { useBoundStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Inputs } from "../inputs";

function CategoryUpdateModal() {
  const queryClient = useQueryClient();
  const {
    category: { toUpdate, setToUpdate },
  } = useBoundStore();
  const isShow = Boolean(toUpdate);

  const { handleSubmit, control, reset } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: updateCategoryMutation,
    onSuccess: (response) => {
      handleCloseAddCategory();
      const category = nestedCategorySchema.parse(response.data);
      queryClient.setQueriesData(
        [QUERY_NESTED_CATEGORIES_KEY],
        (prev: unknown) => {
          const { categories } = prev as NestedCategoriesEntity;

          toast.success("Category Updated");
          return {
            categories: categories.map((existingCategory) =>
              existingCategory._id === category._id
                ? category
                : existingCategory
            ),
          };
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

  useEffect(() => {
    if (toUpdate) {
      reset({ category: toUpdate.category ?? "", id: toUpdate.id });
    }
  }, [toUpdate, reset]);

  function handleCloseAddCategory() {
    reset({ category: "" });
    setToUpdate();
  }

  function onSubmit(values: UpdateCategoryInput) {
    mutate(values);
  }

  return (
    <>
      <Modal
        show={isShow}
        onHide={handleCloseAddCategory}
        keyboard={false}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Category</Modal.Title>
        </Modal.Header>
        <Modal.Body className="row" as="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-9">
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
          <div className="col-3">
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
                <>Update</>
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CategoryUpdateModal;
