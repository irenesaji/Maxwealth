import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Field, Formik, Form } from "formik";
import { updateRiskAnswerChoices } from "@/redux/services/admin/risk_profiles/risk_profiles";
import { Spinner } from "react-bootstrap";
import * as Yup from "yup";

export default function NewAnswerWeightage({
  show,
  onHide,
  questions,
  weightages,
  risk,
  tenant,
}) {
  const [error, setError] = useState("");
  const [msg, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const [portfolios, setPortfolios] = useState([]);
  const newValues = {
    risk_profile_question_id: risk?.[0]?.risk_profile_question_id || "",
    risk_answer_weightage_id: risk?.[0]?.risk_answer_weightage_id || "",
    answer: risk?.[0]?.answer || "",
    answer_image_url: risk?.[0]?.answer_image_url || "",
    position: risk?.[0]?.position || null,
  };
  const Schema = Yup.object().shape({
    risk_profile_question_id: Yup.string().required("Question is required"),
    risk_answer_weightage_id: Yup.string().required("Weightage is required"),
    answer: Yup.string().required("Answer is required"),
    position: Yup.string().required("Position is required"),
  });

  useEffect(() => {
    setMessage("");
    setError("");
  }, []);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await updateRiskAnswerChoices(
        values,
        risk?.[0]?.id,
        tenant
      );
      setMessage("Risk Profile Answer Choice updated successfully!");
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
                  <label htmlFor="risk_profile_question_id">
                    Questions <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    component="select"
                    name="risk_profile_question_id"
                    className="form-control"
                  >
                    <option disabled value="">
                      Select an option
                    </option>
                    {questions.map((question) => {
                      return (
                        <option key={question.id} value={question.id}>
                          {question.question}
                        </option>
                      );
                    })}
                  </Field>
                  {errors.weightage ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.weightage}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="risk_answer_weightage_id">
                    Weightage <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    component="select"
                    name="risk_answer_weightage_id"
                    className="form-control"
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {weightages.map((weightage) => {
                      return (
                        <option key={weightage.id} value={weightage.id}>
                          {weightage.weightage}
                        </option>
                      );
                    })}
                  </Field>
                  {errors.weightage ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.weightage}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="answer">
                    Answer <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field type="text" name="answer" className="form-control" />
                  {errors.answer ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.answer}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="answer_image_url">Answer Image Url</label>
                  <Field
                    type="text"
                    name="answer_image_url"
                    className="form-control"
                  />
                  {errors.answer_image_url ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.answer_image_url}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="position">
                    Position <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field type="text" name="position" className="form-control" />
                  {errors.position ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.position}
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
