import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Field, Formik, Form } from "formik";
import { createAllocation } from "@/redux/services/admin/allocations/allocations";
import { Spinner } from "react-bootstrap";
import * as Yup from "yup";

export default function New({ show, onHide, tenant }) {
  const [error, setError] = useState("");
  const [msg, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const newValues = {
    name: "",
    description: "",
  };
  const Schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  useEffect(() => {
    setMessage("");
    setError("");
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await createAllocation(values, tenant);
      setMessage("Allocation created successfully!");
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
          <Modal.Title>Create New</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={newValues}
            enableReinitialize
            onSubmit={handleSubmit}
            validationSchema={Schema}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                <div>
                  <label htmlFor="name">
                    Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field type="text" name="name" className="form-control" />
                  {errors.name ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.name}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="description">Description</label> &nbsp;
                  <Field
                    component="textarea"
                    name="description"
                    className="form-control"
                    rows="6"
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
                    "Create"
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
