import { QUERY_CLUSTERS_KEY } from "@/constant/query.constant";
import { ClustersEntity } from "@/schema/cluster.schema";
import { ResponseError } from "@/schema/error.schema";
import { deleteClusterMutation } from "@/services/cluster.service";
import { useBoundStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button, Modal } from "react-bootstrap";
import { toast } from "sonner";

function ClusterDeactivateModal() {
  const queryClient = useQueryClient();
  const {
    cluster: { toRemove, setToRemove },
  } = useBoundStore();
  const showDelete = Boolean(toRemove);

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteClusterMutation,
    onSuccess: () => {
      queryClient.setQueriesData([QUERY_CLUSTERS_KEY], (prev: unknown) => {
        const { clusters } = prev as ClustersEntity;
        const upatedCustomers = clusters.filter(
          (item) => item.id !== toRemove?.id
        );

        return { clusters: upatedCustomers };
      });

      toast.success("Cluster removed!");
      setToRemove(undefined);
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
          <Modal.Title>Remove this cluster?</Modal.Title>
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

export default ClusterDeactivateModal;
