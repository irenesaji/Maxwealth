import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Field, Formik, Form } from "formik";
import { createFund } from "@/redux/services/admin/allocations/funds";
import { Spinner } from "react-bootstrap";
import * as Yup from "yup";

export default function New({ show, onHide, allocationId }) {
  const [error, setError] = useState("");
  const [msg, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const newValues = {
    scheme_isin: "",
    scheme_name: "",
    scheme_logo: "",
    scheme_category: "",
    scheme_asset_class: "",
    allocation_percentage: "",
    priority: "",
  };

  const Schema = Yup.object().shape({
    scheme_isin: Yup.string().required("ISIN is required"),
    scheme_name: Yup.string().required("Scheme Name is required"),
    scheme_category: Yup.string().required("Scheme Category is required"),
    scheme_asset_class: Yup.string().required("Scheme Asset Class is required"),
    allocation_percentage: Yup.string().required(
      "Allocation Percentage is required"
    ),
    priority: Yup.string().required("Priority is required"),
  });

  useEffect(() => {
    setMessage("");
    setError("");
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    const data = {
      bulk: [
        {
          scheme_isin: values.scheme_isin,
          scheme_name: values.scheme_name,
          scheme_logo: values.scheme_logo,
          scheme_category: values.scheme_category,
          scheme_asset_class: values.scheme_asset_class,
          allocation_percentage: values.allocation_percentage,
          priority: values.priority,
          model_portfolio_id: allocationId,
        },
      ],
    };
    try {
      const response = await createFund(data);
      setMessage("Fund created successfully!");
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
                  <label for="isin">
                    ISIN <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    type="text"
                    name="scheme_isin"
                    className="form-control"
                  />
                  {errors.scheme_isin ? (
                    <>
                      <p style={{ color: "red" }}>{errors.scheme_isin}</p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label for="scheme_name">
                    Scheme Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    type="text"
                    name="scheme_name"
                    className="form-control"
                  />
                  {errors.scheme_name ? (
                    <>
                      <p style={{ color: "red" }}>{errors.scheme_name}</p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label for="scheme_category">
                    Scheme Category <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    type="text"
                    name="scheme_category"
                    className="form-control"
                  />
                  {errors.scheme_category ? (
                    <>
                      <p style={{ color: "red" }}>{errors.scheme_category}</p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label for="scheme_asset_class">
                    Scheme Asset Class <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    type="text"
                    name="scheme_asset_class"
                    className="form-control"
                  />
                  {errors.scheme_asset_class ? (
                    <>
                      <p style={{ color: "red" }}>
                        {errors.scheme_asset_class}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label for="allocation_percentage">
                    Allocation Percentage{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    type="text"
                    name="allocation_percentage"
                    className="form-control"
                  />
                  {errors.allocation_percentage ? (
                    <>
                      <p style={{ color: "red" }}>
                        {errors.allocation_percentage}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label for="priority">
                    Priority <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field type="text" name="priority" className="form-control" />
                  {errors.priority ? (
                    <>
                      <p style={{ color: "red" }}>{errors.priority}</p>
                    </>
                  ) : null}
                </div>

                <div className="mt-3">
                  <label for="scheme_logo">Scheme Logo Url</label>
                  <Field
                    type="text"
                    name="scheme_logo"
                    className="form-control"
                  />
                  {errors.scheme_logo ? (
                    <>
                      <p style={{ color: "red" }}>{errors.scheme_logo}</p>
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
