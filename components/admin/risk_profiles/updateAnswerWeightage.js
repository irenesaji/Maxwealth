import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Field, Formik, Form } from "formik";
import { updateRiskAnswerWeightage } from "@/redux/services/admin/risk_profiles/risk_profiles";
import { Spinner } from "react-bootstrap";
import * as Yup from "yup";

export default function UpdateAnswerWeightage({ show, onHide, risk, tenant }) {
  const [error, setError] = useState("");
  const [msg, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const [portfolios, setPortfolios] = useState([]);
  const newValues = {
    weightage: risk?.[0]?.weightage || "",
  };
  const Schema = Yup.object().shape({
    weightage: Yup.string().required("Weightage is required"),
  });

  useEffect(() => {
    setMessage("");
    setError("");
  }, []);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await updateRiskAnswerWeightage(
        values,
        risk?.[0]?.id,
        tenant
      );
      setMessage("Risk Profile Question updated successfully!");
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
                <div className="mt-3">
                  <label htmlFor="weightage">
                    Weightage <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    type="text"
                    name="weightage"
                    className="form-control"
                  />
                  {errors.weightage ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.weightage}
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
