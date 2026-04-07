import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  initiateSignIn,
  generateOTPService,
} from "@/redux/services/userService";
import { useRouter } from "next/router";
import { ADMIN_DASHBOARD } from "@/util/urls";
import { isAuthenticated } from "@/util/auth";
import { getSubDomain } from "@/util/common";
export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobile, setMobile] = useState("");
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [tenant, setTenant] = useState("");
  const timerRef = useRef(null);
  const logoSrc = tenant === "elixir" ? "/images/Paisa_Smart.svg" : "/images/maxwealth-logo.png";

  const startOTPTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    let timeLeft = 30;
    setTimer(30);
    setIsTimerActive(true);

    timerRef.current = setInterval(() => {
      timeLeft -= 1;
      setTimer(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setIsTimerActive(false);
      }
    }, 1000);
  };

  useEffect(() => {
    setTenant(getSubDomain());

    if (isAuthenticated()) {
      router.push(ADMIN_DASHBOARD);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [router]);

  const LoginSchema = Yup.object().shape({
    phone: Yup.string()
      .required("Mobile Number is required")
      .matches(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
    otp: Yup.string().when([], {
      is: () => Boolean(mobile),
      then: (schema) =>
        schema
          .required("OTP is required")
          .matches(/^\d{4,6}$/, "Enter a valid OTP"),
      otherwise: (schema) => schema,
    }),
  });

  const initialSigninValues = {
    phone: "",
    otp: "",
  };

  const getErrorMessage = (err) => {
    if (!err) return "Something went wrong";
    if (typeof err === "string") return err;
    if (err?.response?.data?.error) return err.response.data.error;
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.message) return err.message;
    return "Something went wrong";
  };

  const _handleSubmit = async (e, values) => {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await dispatch(
        initiateSignIn({ ...values, phone: mobile || values.phone }, tenant)
      );
      if (response.status === 200) {
        setIsSubmitting(false);
        router.push(ADMIN_DASHBOARD);
      }
    } catch (error) {
      setIsSubmitting(false);
      setError(getErrorMessage(error));
    }
  };

  const generateOTP = async (e, values) => {
    e?.preventDefault?.();
    const phone = (values.phone || mobile || "").trim();
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await generateOTPService(phone, tenant);
      setMobile(phone);
      startOTPTimer();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Max Wealth</title>
        <meta name="description" content="Max Wealth" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div
          className="container d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <div className={`col-lg-4 ${styles.login_form}`}>
            <div className="d-flex justify-content-center text-center">
              <Image
                src={logoSrc}
                width={250}
                height={80}
                alt="Max Wealth logo"
                priority
              />
            </div>

            <p className="error">{error}</p>

            <Formik
              initialValues={initialSigninValues}
              validationSchema={LoginSchema}
              enableReinitialize
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form>
                  {!mobile ? (
                    <>
                      <div role="group" className="d-flex flex-column mb-3">
                        <div className="inputfield">
                          <label htmlFor="phone">Mobile</label>
                          <Field
                            name="phone"
                            type="tel"
                            label=""
                            className="form-control"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={10}
                            onInput={(e) => {
                              const value = (e.target.value || "")
                                .replace(/\D/g, "")
                                .slice(0, 10);
                              setFieldValue("phone", value);
                            }}
                          />
                        </div>
                        {errors.phone ? (
                          <>
                            <p className="error">{errors.phone}</p>
                          </>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary mt-5 w-100"
                        disabled={isSubmitting || !values.phone}
                        onClick={(e) => {
                          generateOTP(e, values);
                        }}
                      >
                        {isSubmitting ? (
                          <Spinner
                            as="span"
                            animation="border"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          "Generate OTP"
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <div role="group" className="d-flex flex-column">
                        <div className="inputfield">
                          <label htmlFor="otp">OTP</label>
                          <Field
                            name="otp"
                            type="tel"
                            label=""
                            className="form-control"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            onInput={(e) => {
                              const value = (e.target.value || "")
                                .replace(/\D/g, "")
                                .slice(0, 6);
                              setFieldValue("otp", value);
                            }}
                          />
                        </div>
                        {errors.otp ? (
                          <>
                            <p className="error">{errors.otp}</p>
                          </>
                        ) : null}
                      </div>

                      <div className="resendOTP">
                        {isTimerActive ? (
                          <div>
                            <p className="resendOTPTimer">
                              Resend OTP in {timer} seconds
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="resendOTPRequest">
                              Didn't receive OTP?{" "}
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  generateOTP(e, values);
                                }}
                              >
                                Resend OTP
                              </a>
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary mt-5 w-100"
                        disabled={isSubmitting || !values.otp}
                        onClick={(e) => {
                          e.preventDefault();
                          _handleSubmit(e, values);
                        }}
                      >
                        {isSubmitting ? (
                          <Spinner
                            as="span"
                            animation="border"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
    </>
  );
}
