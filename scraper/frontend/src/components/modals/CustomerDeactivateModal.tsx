import {
  QUERY_CUSTOMERS_KEY,
  QUERY_CUSTOMER_KEY,
} from "@/constant/query.constant";
import { CustomersEntity } from "@/schema/customer.schema";
import { ResponseError } from "@/schema/error.schema";
import { deleteCustomerMutation } from "@/services/customer.service";
import { useBoundStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button, Modal } from "react-bootstrap";
import { toast } from "sonner";

function CustomerDeactivateModal() {
  const queryClient = useQueryClient();
  const {
    customer: { toDeactivate, setToDeactivate },
  } = useBoundStore();
  const showDelete = Boolean(toDeactivate);

  const { mutate, isLoading } = useMutation({
    mutationKey: [QUERY_CUSTOMER_KEY, toDeactivate?.id],
    mutationFn: deleteCustomerMutation,
    onSuccess: () => {
      queryClient.setQueriesData([QUERY_CUSTOMERS_KEY], (prev: unknown) => {
        const { customers } = prev as CustomersEntity;
        const upatedCustomers = customers.filter(
          (item) => item.id !== toDeactivate?.id
        );

        return { customers: upatedCustomers };
      });

      queryClient.removeQueries([QUERY_CUSTOMER_KEY, toDeactivate?.id]);
      toast.success("Customer Deactivated");
      setToDeactivate(undefined);
    },
    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;
        toast.error(responseError.data.detail);
      }
    },
  });

  function handleMutate() {
    if (toDeactivate) {
      mutate(toDeactivate?.id ?? "");
    }
  }

  function handleClose() {
    setToDeactivate(undefined);
  }

  return (
    <>
      <Modal show={showDelete} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deactivate this Customer?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This action can’t be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleMutate} disabled={isLoading}>
            Deactivate{" "}
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

export default CustomerDeactivateModal;
