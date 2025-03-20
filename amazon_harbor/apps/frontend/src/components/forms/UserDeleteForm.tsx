import { Button } from "@/components/ui/button";
import { QUERY_USERS_KEY } from "@/contant/query.contant";
import useBoundStore from "@/hooks/useBoundStore";
import { deleteUser } from "@/services/user.service";
import { User } from "@repo/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Modal from "react-bootstrap/Modal";
import { toast } from "sonner";

export interface UserDeleteFormProps {
  user: User;
}

function UserDeleteForm({ user }: UserDeleteFormProps) {
  const { closeDialog } = useBoundStore();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: [QUERY_USERS_KEY],
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User has been deleted!");
      closeDialog();
      queryClient.setQueriesData<User[]>(
        { queryKey: [QUERY_USERS_KEY] },
        (items) => {
          if (items) {
            return items.filter((item) => item._id !== user._id);
          }
          return items;
        }
      );
    },
    onError: ({ response }: AxiosError) => {
      if (response) console.log(response);
    },
  });

  function handleMutate() {
    mutate(user._id);
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Delete this user?</Modal.Title>
      </Modal.Header>
      <Modal.Body>This action can’t be undone.</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleMutate}>
          {isPending ? (
            <span className="spinner-border spinner-border-xs"></span>
          ) : null}
          <span className="px-2">Delete</span>
        </Button>
        <Button variant="outline-secondary" onClick={closeDialog}>
          Cancel
        </Button>
      </Modal.Footer>
    </>
  );
}

export default UserDeleteForm;
