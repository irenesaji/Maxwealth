import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Field, Formik, Form } from "formik";
import { Spinner } from "react-bootstrap";
import * as Yup from "yup";
import { createUser } from "@/redux/services/admin/users/users";

export default function New({ show, onHide, tenant }) {
  const [error, setError] = useState("");
  const [msg, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    full_name: "",
    email: "",
    mobile: "",
    sub_role: "",
    arn_code: "",
    euin_code: "",
    arn_expiry_date: "",
    is_blocked: false,
  };

  const schema = Yup.object().shape({
    full_name: Yup.string().trim().required("Full Name is required"),
    email: Yup.string().trim().email("Invalid email").required("Email is required"),
    mobile: Yup.string()
      .trim()
      .matches(/^\d{10}$/, "Mobile must be 10 digits")
      .required("Mobile No is required"),
    sub_role: Yup.string().required("Sub Role is required"),
    arn_code: Yup.string().when("sub_role", {
      is: "subbroker",
      then: (rule) => rule.trim().required("ARN Code is required"),
      otherwise: (rule) => rule.notRequired(),
    }),
    euin_code: Yup.string().when("sub_role", {
      is: "subbroker",
      then: (rule) => rule.trim().required("EUIN Code is required"),
      otherwise: (rule) => rule.notRequired(),
    }),
    arn_expiry_date: Yup.string().when("sub_role", {
      is: "subbroker",
      then: (rule) => rule.required("ARN Expiry Date is required"),
      otherwise: (rule) => rule.notRequired(),
    }),
  });

  useEffect(() => {
    setMessage("");
    setError("");
  }, [show]);

  const handleSubmit = async (values) => {
    if (!tenant) {
      setError("Tenant is missing. Please refresh and try again.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const now = new Date().toISOString();
    const userCode = `U${values.mobile}`;
    const payload = {
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      mobile: values.mobile.trim(),
      sub_role: values.sub_role,
      arn_code: values.sub_role === "subbroker" ? values.arn_code.trim() : "",
      euin_code: values.sub_role === "subbroker" ? values.euin_code.trim() : "",
      arn_expiry_date:
        values.sub_role === "subbroker" ? values.arn_expiry_date : null,
      country_code: "+91",
      is_blocked: values.is_blocked,
      is_active: true,
      is_lead: values.sub_role === "subbroker",
      mobile_verified: false,
      is_daily_portfolio_updates: true,
      is_whatsapp_notifications: true,
      is_enable_biometrics: true,
      is_email_verified: false,
      user_code: userCode,
      referral_code: `REF${values.mobile.trim()}`,
      fcmToken: "",
      email_otp: 1111,
      otp: 1111,
      expiry_time: now,
      created_at: now,
      updated_at: now,
      role: "User",
    };

    try {
      await createUser(payload, tenant);
      setMessage("Staff created successfully!");
      onHide(true);
      location.reload();
    } catch (err) {
      const message =
        err?.data?.message || err?.data?.error || "Failed to create staff";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Staff</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, setFieldValue }) => (
            <Form>
              <div>
                <label htmlFor="full_name">Full Name</label>
                <Field
                  type="text"
                  name="full_name"
                  className="form-control"
                  placeholder="Enter full name"
                />
                {errors.full_name ? (
                  <p style={{ color: "red", fontSize: 12 }}>{errors.full_name}</p>
                ) : null}
              </div>

              <div className="mt-3">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                />
                {errors.email ? (
                  <p style={{ color: "red", fontSize: 12 }}>{errors.email}</p>
                ) : null}
              </div>

              <div className="mt-3">
                <label htmlFor="mobile">Mobile</label>
                <Field
                  type="text"
                  name="mobile"
                  className="form-control"
                  placeholder="Enter mobile number"
                />
                {errors.mobile ? (
                  <p style={{ color: "red", fontSize: 12 }}>{errors.mobile}</p>
                ) : null}
              </div>

              <div className="mt-3">
                <label htmlFor="sub_role">Sub Role</label>
                <Field as="select" name="sub_role" className="form-control">
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="staff">Staff</option>
                  <option value="ops_team">Ops Team</option>
                  <option value="admin">Admin</option>
                  <option value="subbroker">Subbroker</option>
                </Field>
                {errors.sub_role ? (
                  <p style={{ color: "red", fontSize: 12 }}>{errors.sub_role}</p>
                ) : null}
              </div>

              {values.sub_role === "subbroker" ? (
                <>
                  <div className="mt-3">
                    <label htmlFor="arn_code">ARN Code</label>
                    <Field
                      type="text"
                      name="arn_code"
                      className="form-control"
                      placeholder="Enter ARN Code"
                    />
                    {errors.arn_code ? (
                      <p style={{ color: "red", fontSize: 12 }}>{errors.arn_code}</p>
                    ) : null}
                  </div>

                  <div className="mt-3">
                    <label htmlFor="euin_code">EUIN Code</label>
                    <Field
                      type="text"
                      name="euin_code"
                      className="form-control"
                      placeholder="Enter EUIN Code"
                    />
                    {errors.euin_code ? (
                      <p style={{ color: "red", fontSize: 12 }}>{errors.euin_code}</p>
                    ) : null}
                  </div>

                  <div className="mt-3">
                    <label htmlFor="arn_expiry_date">ARN Expiry Date</label>
                    <Field
                      type="date"
                      name="arn_expiry_date"
                      className="form-control"
                      placeholder="Enter ARN Expiry Date"
                    />
                    {errors.arn_expiry_date ? (
                      <p style={{ color: "red", fontSize: 12 }}>{errors.arn_expiry_date}</p>
                    ) : null}
                  </div>
                </>
              ) : null}

              <div className="mt-3">
                <label htmlFor="is_blocked">Block</label>
                <div className="d-flex align-items-center">
                  <Field
                    type="radio"
                    name="is_blocked"
                    value={false}
                    checked={values.is_blocked === false}
                    onChange={() => setFieldValue("is_blocked", false)}
                  />
                  &nbsp;
                  <label htmlFor="is_blocked">No</label>
                  &nbsp;
                  <Field
                    type="radio"
                    name="is_blocked"
                    value={true}
                    checked={values.is_blocked === true}
                    onChange={() => setFieldValue("is_blocked", true)}
                  />
                  &nbsp;
                  <label htmlFor="is_blocked">Yes</label>
                </div>
              </div>

              <div className="mt-4 d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                  ) : (
                    "Create"
                  )}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => onHide(false)}>
                  Cancel
                </button>
              </div>

              <p style={{ color: "red" }}>{error}</p>
              <p style={{ color: "green" }}>{msg}</p>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
