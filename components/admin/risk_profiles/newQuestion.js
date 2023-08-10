import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Field, Formik, Form } from "formik";
import { createRiskProfileQuestion } from "@/redux/services/admin/risk_profiles/risk_profiles";
import { Spinner } from "react-bootstrap";
import * as Yup from "yup";

export default function NewQuestion({ show, onHide }) {
  const [error, setError] = useState("");
  const [msg, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const [portfolios, setPortfolios] = useState([]);
  const newValues = {
    question: "",
    description: "",
    is_active: null,
  };
  const Schema = Yup.object().shape({
    question: Yup.string().required("Question is required"),
    is_active: Yup.string().required("isActive is required"),
  });

  useEffect(() => {
    setMessage("");
    setError("");
  }, []);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await createRiskProfileQuestion(values);
      setMessage("Risk Profile Question created successfully!");
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
                <div className="mt-3">
                  <label htmlFor="question">
                    Question <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field type="text" name="question" className="form-control" />
                  {errors.question ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.question}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="description">Description</label>
                  <Field
                    component="textarea"
                    name="description"
                    className="form-control"
                    rows={6}
                  />
                  {errors.description ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.description}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
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
