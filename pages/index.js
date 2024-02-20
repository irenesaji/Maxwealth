import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  initiateSignIn,
  generateOTPService,
} from "@/redux/services/userService";
import { useRouter } from "next/router";
import { ADMIN_DASHBOARD, ADMIN_USERS } from "@/util/urls";
import { isAuthenticated } from "@/util/auth";
import { getSubDomain } from "@/util/common";
export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const userStore = useSelector((state) => state.user);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const [mobile, setMobile] = useState("");
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [otpHasBeenSent, setotpHasBeenSent] = useState(true);
  const [handleOTP, setHandleOTP] = useState(0);
  const [tenant, setTenant] = useState("");
  useEffect(() => {
    setTenant(getSubDomain());

    if (isAuthenticated()) {
      router.push(ADMIN_DASHBOARD);
    }
  }, [tenant]);
  const LoginSchema = Yup.object().shape({
    phone: Yup.string().required("Mobile Number is required"),
  });

  const initialSigninValues = {
    phone: "",
    otp: "",
  };

  const _handleSubmit = async (e, values) => {
    setIsSubmitting(true);
    try {
      const response = await dispatch(initiateSignIn(values, tenant));
      if (response.status === 200) {
        setIsSubmitting(false);
        router.push(ADMIN_DASHBOARD);
      }
    } catch (error) {
      setIsSubmitting(false);
      setError(error);
    }
  };

  // console.log(userStore.user);

  const generateOTP = async (e, values) => {
    setMobile(values.phone);
    try {
      const response = await generateOTPService(values.phone || mobile, tenant);
    } catch (error) {
      console.log(error);
    }

    var timeLeft = 30; // set the time limit in seconds
    var timer = setInterval(function () {
      setIsTimerActive(true);
      setotpHasBeenSent(true);
      timeLeft--;
      setTimer(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);
        setotpHasBeenSent(false);
        setIsTimerActive(false);
      }
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Max Wealth</title>
        <meta name="description" content="Max Wealth" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className>
        <div
          className="container d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <div className={`col-lg-4 ${styles.login_form}`}>
            <p className="text-center">
              <Image
                src="/images/logo.png"
                width={250}
                height={80}
                alt="logo"
              />
            </p>

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
                            type="text"
                            label=""
                            className="form-control"

                            // placeholder="Enter email"
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
                        disabled={isSubmitting}
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
                            type="text"
                            label=""
                            className="form-control"
                            // placeholder="Enter password"
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
                        disabled={isSubmitting}
                        onClick={(e) => _handleSubmit(e, values)}
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
