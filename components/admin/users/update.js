import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Field, Formik, Form } from "formik";
import { updateUser } from "@/redux/services/admin/users/users";
import { Spinner } from "react-bootstrap";

export default function Update({ show, onHide, id, user }) {
  const [error, setError] = useState("");
  const [msg, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const updateValues = {
    is_active: user?.[0]?.is_active,
    is_blocked: user?.[0]?.is_blocked,
  };

  useEffect(() => {
    setMessage("");
    setError("");
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await updateUser(id, values);
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
          <Modal.Title>Update {user?.[0]?.full_name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={updateValues}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                <label htmlFor="is_active">isActive?</label>
                <div className="d-flex align-items-center">
                  <Field
                    type="radio"
                    name="is_active"
                    value={true}
                    checked={values.is_active === true}
                    onChange={() => setFieldValue("is_active", true)}
                  />
                  &nbsp;
                  <label htmlFor="is_active">Yes</label> &nbsp;
                  <Field
                    type="radio"
                    name="is_active"
                    value={false}
                    checked={values.is_active === false}
                    onChange={() => setFieldValue("is_active", false)}
                  />
                  &nbsp;
                  <label htmlFor="is_active">No</label>
                </div>

                <label htmlFor="is_blocked">isBlocked?</label>
                <div className="d-flex align-items-center">
                  <Field
                    type="radio"
                    name="is_blocked"
                    value={true}
                    checked={values.is_blocked === true}
                    onChange={() => setFieldValue("is_blocked", true)}
                  />
                  &nbsp;
                  <label for="is_blocked">Yes</label> &nbsp;
                  <Field
                    type="radio"
                    name="is_blocked"
                    value={false}
                    checked={values.is_blocked === false}
                    onChange={() => setFieldValue("is_blocked", false)}
                  />
                  &nbsp;
                  <label for="is_blocked">No</label>
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
