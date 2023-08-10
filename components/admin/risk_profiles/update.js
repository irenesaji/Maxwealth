import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Field, Formik, Form } from "formik";
import { getAllocations } from "@/redux/services/admin/allocations/allocations";
import { updateRiskProfile } from "@/redux/services/admin/risk_profiles/risk_profiles";
import { Spinner } from "react-bootstrap";
import * as Yup from "yup";

export default function Update({ show, onHide, risk }) {
  const [error, setError] = useState("");
  const [msg, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const [portfolios, setPortfolios] = useState([]);
  const newValues = {
    name: risk?.[0]?.name || "",
    description: risk?.[0]?.description || "",
    low: `${risk?.[0]?.low}` || "",
    high: `${risk?.[0]?.high}` || "",
    is_active: risk?.[0]?.is_active || null,
    display_equity_allocation: `${risk?.[0]?.display_equity_allocation}` || "",
    min_equity_allocation: `${risk?.[0]?.min_equity_allocation}` || "",
    max_equity_allocation: `${risk?.[0]?.max_equity_allocation}` || "",
    display_debt_allocation: `${risk?.[0]?.display_debt_allocation}` || "",
    min_debt_allocation: `${risk?.[0]?.min_debt_allocation}` || "",
    max_debt_allocation: `${risk?.[0]?.max_debt_allocation}` || "",
    display_liquid_allocation: `${risk?.[0]?.display_liquid_allocation}` || "",
    min_liquid_allocation: `${risk?.[0]?.min_liquid_allocation}` || "",
    max_liquid_allocation: `${risk?.[0]?.max_liquid_allocation}` || "",
    model_portfolio_id: risk?.[0]?.model_portfolio_id || "",
  };
  const Schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    low: Yup.string().required("Low is required"),
    high: Yup.string().required("High is required"),
    is_active: Yup.string().required("isActive is required"),
    display_equity_allocation: Yup.string().required(
      "Display Equity Allocation is required"
    ),
    min_equity_allocation: Yup.string().required(
      "Min Equity Allocation is required"
    ),
    max_equity_allocation: Yup.string().required(
      "Max Equity Allocation is required"
    ),
    display_debt_allocation: Yup.string().required(
      "Display Debt Allocation is required"
    ),
    min_debt_allocation: Yup.string().required(
      "Min Debt Allocation is required"
    ),
    max_debt_allocation: Yup.string().required(
      "Max Debt Allocation is required"
    ),
    display_liquid_allocation: Yup.string().required(
      "Display Liquid Allocation is required"
    ),
    min_liquid_allocation: Yup.string().required(
      "Min Liquid Allocation is required"
    ),
    max_liquid_allocation: Yup.string().required(
      "Max Liquid Allocation is required"
    ),
    model_portfolio_id: Yup.string().required("Model Portfilio is required"),
  });

  const modelPortfolios = async () => {
    try {
      const response = await getAllocations();
      setPortfolios(response);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    setMessage("");
    setError("");
    modelPortfolios();
  }, []);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await updateRiskProfile(values, risk?.[0]?.id);
      setMessage("Risk Profile updated successfully!");
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
          <Modal.Title>Update {risk?.[0]?.name}</Modal.Title>
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
                    defaultValue={values.model_portfolio_id}
                  >
                    <option value="" selected disabled>
                      Select an option
                    </option>
                    {portfolios &&
                      portfolios.map((portfolio) => {
                        return (
                          <option value={portfolio.id} key={portfolio.id}>
                            {portfolio.name}
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
                <div className="mt-3">
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
                  <label htmlFor="low">Low</label> &nbsp;
                  <Field
                    type="text"
                    name="low"
                    className="form-control"
                    rows="6"
                  />
                  {errors.low ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>{errors.low}</p>
                    </>
                  ) : null}
                </div>
                <div className="mt-3">
                  <label htmlFor="high">High</label> &nbsp;
                  <Field
                    type="text"
                    name="high"
                    className="form-control"
                    rows="6"
                  />
                  {errors.high ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.high}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="display_equity_allocation">
                    Display Equity Allocation
                  </label>{" "}
                  &nbsp;
                  <Field
                    type="text"
                    name="display_equity_allocation"
                    className="form-control"
                    rows="6"
                  />
                  {errors.display_equity_allocation ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.display_equity_allocation}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="min_equity_allocation">
                    Min Equity Allocation
                  </label>{" "}
                  &nbsp;
                  <Field
                    type="text"
                    name="min_equity_allocation"
                    className="form-control"
                    rows="6"
                  />
                  {errors.min_equity_allocation ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.min_equity_allocation}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="max_equity_allocation">
                    Max Equity Allocation
                  </label>{" "}
                  &nbsp;
                  <Field
                    type="text"
                    name="max_equity_allocation"
                    className="form-control"
                    rows="6"
                  />
                  {errors.max_equity_allocation ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.max_equity_allocation}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="display_debt_allocation">
                    Display Debt Allocation
                  </label>{" "}
                  &nbsp;
                  <Field
                    type="text"
                    name="display_debt_allocation"
                    className="form-control"
                    rows="6"
                  />
                  {errors.display_debt_allocation ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.display_debt_allocation}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="min_debt_allocation">
                    Min Debt Allocation
                  </label>{" "}
                  &nbsp;
                  <Field
                    type="text"
                    name="min_debt_allocation"
                    className="form-control"
                    rows="6"
                  />
                  {errors.min_debt_allocation ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.min_debt_allocation}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="max_debt_allocation">
                    Max Debt Allocation
                  </label>{" "}
                  &nbsp;
                  <Field
                    type="text"
                    name="max_debt_allocation"
                    className="form-control"
                    rows="6"
                  />
                  {errors.max_debt_allocation ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.max_debt_allocation}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="display_liquid_allocation">
                    Display Liquid Allocation
                  </label>{" "}
                  &nbsp;
                  <Field
                    type="text"
                    name="display_liquid_allocation"
                    className="form-control"
                    rows="6"
                  />
                  {errors.display_liquid_allocation ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.display_liquid_allocation}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="min_liquid_allocation">
                    Min Liquid Allocation
                  </label>{" "}
                  &nbsp;
                  <Field
                    type="text"
                    name="min_liquid_allocation"
                    className="form-control"
                    rows="6"
                  />
                  {errors.min_liquid_allocation ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.min_liquid_allocation}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label htmlFor="max_liquid_allocation">
                    Max Liquid Allocation
                  </label>{" "}
                  &nbsp;
                  <Field
                    type="text"
                    name="max_liquid_allocation"
                    className="form-control"
                    rows="6"
                  />
                  {errors.max_liquid_allocation ? (
                    <>
                      <p style={{ color: "red", fontSize: 12 }}>
                        {errors.max_liquid_allocation}
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
