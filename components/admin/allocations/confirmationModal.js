import {Modal,Button} from "react-bootstrap";

export default function ConfirmationModal({ show, onHide,onProceed }) {
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete the record?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onProceed}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
