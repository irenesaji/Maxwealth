import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Field, Formik, Form } from "formik";
import { updateGoal } from "@/redux/services/admin/goals/goals";
import { Spinner } from "react-bootstrap";
import * as Yup from "yup";

export default function New({ show, onHide, allocationData, goals, tenant }) {
  const [error, setError] = useState("");
  const [msg, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const newValues = {
    model_portfolio_id: goals?.[0]?.model_portfolio_id || "",
    name: goals?.[0]?.name || "",
    description: goals?.[0]?.description || "",
    icon: goals?.[0]?.icon || "",
  };
  const Schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    model_portfolio_id: Yup.string().required("Model Portfolio  is required"),
  });

  useEffect(() => {
    setMessage("");
    setError("");
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await updateGoal(values, goals?.[0]?.id, tenant);
      setMessage("Goal updated successfully!");
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
          <Modal.Title>Update</Modal.Title>
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
                  <label htmlFor="model_portfolio_id">
                    Model Portfolio <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    component="select"
                    name="model_portfolio_id"
                    className="form-control"
                  >
                    <option disabled value="">
                      Select an option
                    </option>
                    {allocationData &&
                      allocationData.map((datum) => {
                        return (
                          <option key={datum.id} value={datum.id}>
                            {datum.name}
                          </option>
                        );
                      })}
                  </Field>
                  {errors.model_portfolio_id ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.model_portfolio_id}
                      </p>
                    </>
                  ) : null}
                </div>
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

                <div>
                  <label htmlFor="name">Icon</label>
                  <Field type="text" name="icon" className="form-control" />
                  {errors.icon ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.icon}
                      </p>
                    </>
                  ) : null}
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
