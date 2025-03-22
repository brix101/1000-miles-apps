import { QUERY_NESTED_CATEGORIES_KEY } from "@/constant/query.constant";
import { NestedCategoriesEntity } from "@/schema/category.schema";
import { ResponseError } from "@/schema/error.schema";
import { removeCategoryMutation } from "@/services/category.service";
import { useBoundStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button, Modal } from "react-bootstrap";
import { toast } from "sonner";

function CategoryRemoveModal() {
  const queryClient = useQueryClient();
  const {
    category: { toRemove, setToRemove },
  } = useBoundStore();
  const showDelete = Boolean(toRemove);

  const { mutate, isLoading } = useMutation({
    mutationFn: removeCategoryMutation,
    onSuccess: () => {
      queryClient.setQueriesData(
        [QUERY_NESTED_CATEGORIES_KEY],
        (prev: unknown) => {
          const { categories } = prev as NestedCategoriesEntity;
          const upatedCustomers = categories.filter(
            (item) => item.id !== toRemove?.id
          );

          return { categories: upatedCustomers };
        }
      );
      toast.success("Category Removed");
      queryClient.invalidateQueries({
        queryKey: [QUERY_NESTED_CATEGORIES_KEY],
      });
      handleClose();
    },

    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;
        toast.error(responseError.data.detail);
      }
    },
  });

  function handleMutate() {
    if (toRemove) {
      mutate(toRemove?.id ?? "");
    }
  }

  function handleClose() {
    setToRemove(undefined);
  }

  return (
    <>
      <Modal show={showDelete} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Remove this Category?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This action can’t be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleMutate} disabled={isLoading}>
            Remove{" "}
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                style={{ height: 16, width: 16 }}
              ></span>
            ) : undefined}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CategoryRemoveModal;
