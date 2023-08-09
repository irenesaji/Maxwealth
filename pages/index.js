import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { initiateSignIn } from "@/redux/services/userService";
import { useRouter } from "next/router";
import { ADMIN_USERS } from "@/util/urls";
import { isAuthenticated } from "@/util/auth";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const userStore = useSelector((state) => state.user);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");

  // useEffect(() => {
  //   if (isAuthenticated()) {
  //     router.push(ADMIN_USERS);
  //   }
  // }, []);
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const initialSigninValues = {
    email: "",
    password: "",
  };

  const _handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await dispatch(initiateSignIn(values));
      if (response.status === 200) {
        setIsSubmitting(false);
        router.push(ADMIN_USERS);
      }
    } catch (error) {
      setIsSubmitting(false);
      setError(error);
    }
  };

  // console.log(userStore.user);

  return (
    <>
      <Head>
        <title>Findola Capital</title>
        <meta name="description" content="Findola Capital" />
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
              onSubmit={_handleSubmit}
              enableReinitialize
            >
              {({ values, errors, touched }) => (
                <Form>
                  <div role="group" className="d-flex flex-column mb-3">
                    <div className="inputfield">
                      <label htmlFor="email">Email</label>
                      <Field
                        name="email"
                        type="email"
                        label=""
                        className="form-control"

                        // placeholder="Enter email"
                      />
                    </div>
                    {errors.email ? (
                      <>
                        <p className="error">{errors.email}</p>
                      </>
                    ) : null}
                  </div>

                  <div role="group" className="d-flex flex-column">
                    <div className="inputfield">
                      <label htmlFor="password">Password</label>
                      <Field
                        name="password"
                        type="password"
                        label=""
                        className="form-control"
                        // placeholder="Enter password"
                      />
                    </div>
                    {errors.password ? (
                      <>
                        <p className="error">{errors.password}</p>
                      </>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary mt-5 w-100"
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
                      "Sign In"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
    </>
  );
}
