import useBoundStore from "@/hooks/useBoundStore";
import Modal from "react-bootstrap/Modal";
function ModalPortal() {
  const { item, size } = useBoundStore((state) => state.dialog);
  const setDialogItem = useBoundStore((state) => state.setDialogItem);
  const isShow = Boolean(item);

  function handleClose() {
    setDialogItem({ item: undefined });
  }

  return (
    <Modal show={isShow} onHide={handleClose} backdrop="static" size={size}>
      <>{item}</>
    </Modal>
  );
}

export default ModalPortal;
