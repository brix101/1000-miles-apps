import { Icons } from "@/assets/icons";
import { QUERY_NESTED_CATEGORIES_KEY } from "@/constant/query.constant";
import {
  NestedCategoriesEntity,
  NestedCategoryEntity,
  UpdateCategoryInput,
  nestedCategorySchema,
  updateCategorySchema,
} from "@/schema/category.schema";
import { ResponseError } from "@/schema/error.schema";
import {
  addChildCategoryMutation,
  removeChildCategoryMutation,
  updateCategoryMutation,
} from "@/services/category.service";
import { useBoundStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useOnClickOutside } from "usehooks-ts";
import { Inputs } from "../inputs";

function CategoryUpdateChildModal() {
  const queryClient = useQueryClient();
  const {
    category: { toUpdateParent, setToUpdateParent },
  } = useBoundStore();
  const isShow = Boolean(toUpdateParent);

  const { getValues, control, reset } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: addChildCategoryMutation,
    onSuccess: (response) => {
      const category = nestedCategorySchema.parse(response.data);
      queryClient.setQueriesData(
        [QUERY_NESTED_CATEGORIES_KEY],
        (prev: unknown) => {
          const { categories } = prev as NestedCategoriesEntity;

          toast.success("Sub Category Added");
          return {
            categories: categories.map((existingCategory) =>
              existingCategory.id === category.id ? category : existingCategory
            ),
          };
        }
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_NESTED_CATEGORIES_KEY],
      });
      setToUpdateParent(category);
      reset({ category: "" });
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
    setToUpdateParent(undefined);
  }

  function handleSubmit() {
    const values = getValues();
    mutate({ ...values, id: toUpdateParent?.id ?? "" });
  }

  const childCategories = toUpdateParent?.sub?.map((category, index) => (
    <CategoryBadge
      key={index}
      category={category}
      parentId={toUpdateParent.id ?? ""}
    />
  ));

  return (
    <>
      <Modal
        show={isShow}
        onHide={handleCloseAddCategory}
        keyboard={false}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <CategoryName category={toUpdateParent} />
        </Modal.Header>
        <Modal.Body className="pt-0 p-4">
          <div className="pb-4">
            <label className="form-label">Sub Category</label>
            <div
              className="form-control bg-white scrollbar-overlay"
              style={{
                height: "30vh",
              }}
            >
              {childCategories}
            </div>
          </div>
          <div className="row p-0">
            <div className="col-9">
              <div className="text-start w-100">
                <Controller
                  name="category"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Inputs.Primary
                      placeholder="Input Sub Category here..."
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
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
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
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

function CategoryName({ category }: { category?: NestedCategoryEntity }) {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");

  const {
    category: { setToUpdateParent },
  } = useBoundStore();
  const { mutate } = useMutation({
    mutationFn: updateCategoryMutation,
    onSuccess: (response) => {
      const category = nestedCategorySchema.parse(response.data);
      queryClient.setQueriesData(
        [QUERY_NESTED_CATEGORIES_KEY],
        (prev: unknown) => {
          const { categories } = prev as NestedCategoriesEntity;

          return {
            categories: categories.map((existingCategory) =>
              existingCategory.id === category.id ? category : existingCategory
            ),
          };
        }
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_NESTED_CATEGORIES_KEY],
      });
      setToUpdateParent(category);
    },
    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;
        console.log(responseError);
      }
    },
  });
  const handleDoubleClick = () => {
    if (ref.current) {
      console.log("docuble clickj");
      ref.current.focus();
    }
  };

  const handleClickOutside = () => {
    if (name !== category?.category) {
      mutate({ id: category?.id ?? "", category: name });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  useOnClickOutside(ref, handleClickOutside);

  useEffect(() => {
    if (category) {
      setName(category.category ?? "");
    }
  }, [category]);

  return (
    <input
      ref={ref}
      disabled
      className="modal-title h4 rounded-2 category-title-input"
      value={name}
      onBlur={handleClickOutside}
      onChange={(e) => setName(e.target.value)}
      onKeyDown={handleKeyPress}
      onDoubleClick={handleDoubleClick}
    />
  );
}

function CategoryBadge({
  category,
  parentId,
}: {
  category: NestedCategoryEntity;
  parentId: string;
}) {
  const queryClient = useQueryClient();
  const {
    category: { setToUpdateParent: setToUpdateChild },
  } = useBoundStore();

  const { mutate, isLoading } = useMutation({
    mutationFn: removeChildCategoryMutation,
    onSuccess: (response) => {
      const category = nestedCategorySchema.parse(response.data);
      queryClient.setQueriesData(
        [QUERY_NESTED_CATEGORIES_KEY],
        (prev: unknown) => {
          const { categories } = prev as NestedCategoriesEntity;

          toast.success("Category Updated");
          return {
            categories: categories.map((existingCategory) =>
              existingCategory.id === category.id ? category : existingCategory
            ),
          };
        }
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_NESTED_CATEGORIES_KEY],
      });
      setToUpdateChild(category);
    },
    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;
        console.log(responseError);
      }
    },
  });

  function handleRemoveClick() {
    mutate({ id: parentId, sub_ids: [category.id ?? ""] });
  }
  return (
    <div className="badge badge-tag-custom me-1 mb-1">
      <span className="m-1">{category.category}</span>
      <button
        className="btn-icon-custom"
        onClick={handleRemoveClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <span
            className="spinner-border spinner-border-sm text-dark"
            style={{ height: 10, width: 10 }}
          ></span>
        ) : (
          <Icons.UMultiply height={12} width={12} />
        )}
      </button>
    </div>
  );
}

export default CategoryUpdateChildModal;
