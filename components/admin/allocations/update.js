import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Field, Formik, Form } from "formik";
import { updateAllocation } from "@/redux/services/admin/allocations/allocations";
import { Spinner } from "react-bootstrap";

export default function UpdateModal({ show, onHide, id, allocations, tenant }) {
  const [error, setError] = useState("");
  const [msg, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const updateValues = {
    name: allocations?.[0]?.name,
    description: allocations?.[0]?.description,
  };

  useEffect(() => {
    setMessage("");
    setError("");
  }, []);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await updateAllocation(id, values, tenant);
      setMessage("Values updated successfully!");
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
          <Modal.Title>Update </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={updateValues}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                <label htmlFor="name">Name</label>
                <div className="d-flex align-items-center">
                  <Field
                    type="text"
                    name="name"
                    value={values.name}
                    className="form-control"
                  />
                  &nbsp;
                </div>
                <br />
                <label htmlFor="description">Description</label>
                <div className="d-flex align-items-center">
                  <Field
                    type="textarea"
                    name="description"
                    value={values.description}
                    className="form-control"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mt-5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner
                      as="span"
                      animation="border"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    "Update"
                  )}
                </button>
                <p style={{ color: "red" }}>{error}</p>
                <p style={{ color: "green" }}>{msg}</p>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}
