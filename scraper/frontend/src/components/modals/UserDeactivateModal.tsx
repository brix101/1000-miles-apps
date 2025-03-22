import { QUERY_USERS_KEY } from "@/constant/query.constant";
import { ResponseError } from "@/schema/error.schema";
import { UsersEntity } from "@/schema/user.schema";
import { deleteUsersMutation } from "@/services/user.service";
import { useBoundStore } from "@/store";
import compareArrays from "@/utils/compare2array";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button, Modal } from "react-bootstrap";
import { toast } from "sonner";

function UserDeactivateModal() {
  const queryClient = useQueryClient();
  const {
    user: { toDeactivate, selectedUser },
    resetToDeactivateUser,
    resetSelectedUser,
  } = useBoundStore();

  const toDeactivateLength = toDeactivate.length;
  const text = "User" + (toDeactivateLength > 1 ? "s" : "");
  const isShow = Boolean(toDeactivateLength);
  const isSame = compareArrays(toDeactivate, selectedUser);

  const { mutate, isLoading } = useMutation({
    mutationKey: [QUERY_USERS_KEY],
    mutationFn: deleteUsersMutation,
    onSuccess: () => {
      queryClient.setQueriesData([QUERY_USERS_KEY], (prev: unknown) => {
        const { users } = prev as UsersEntity;
        const upatedUsers = users.filter(
          (item) => !toDeactivate.includes(item.id ?? "")
        );
        return { users: upatedUsers };
      });

      toast.success(`${text} Deactivated`);
      if (isSame) {
        resetSelectedUser();
      }
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
    mutate(toDeactivate);
  }

  function handleClose() {
    resetToDeactivateUser();
  }

  return (
    <>
      <Modal
        show={isShow}
        onHide={handleClose}
        backdrop="static"
        style={{ userSelect: "none" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Deactivate this {text}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This action can’t be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleMutate} disabled={isLoading}>
            Deactivate{" "}
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                style={{ height: 16, width: 16 }}
              ></span>
            ) : undefined}
          </Button>
          <Button variant="outline-secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserDeactivateModal;
