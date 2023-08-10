import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { deleteRiskProfile } from "@/redux/services/admin/risk_profiles/risk_profiles";
import { Spinner } from "react-bootstrap";

export default function Delete({ show, onHide, id }) {
  const [error, setError] = useState("");
  const [msg, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");

  useEffect(() => {
    setMessage("");
    setError("");
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await deleteRiskProfile(id);
      setMessage("Risk Profile deleted successfully!");
      setIsSubmitting(false);
      onHide(true);
      location.reload();
    } catch (error) {
      setIsSubmitting(false);
      setError(error.response);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Record</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to delete?</p>
          <button
            type="button"
            className="btn btn-danger mt-5"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <Spinner
                as="span"
                animation="border"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Delete"
            )}
          </button>
          <p style={{ color: "red" }}>{error}</p>
          <p style={{ color: "green" }}>{msg}</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
