import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";

export default function Home() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
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

  const handleSubmit = () => {};

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
              <Image src="/images/logo.png" width={250} height={80} />
            </p>

            <Formik
              initialValues={initialSigninValues}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched }) => (
                <Form>
                  <div role="group" className="d-flex flex-column mb-3">
                    <div className="inputfield">
                      <label for="email">Email</label>
                      <Field
                        name="email"
                        type="email"
                        label=""
                        className="form-control"
                        placeholder="Enter email"
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
                      <label for="password">Password</label>
                      <Field
                        name="password"
                        type="password"
                        label=""
                        className="form-control"
                        placeholder="Enter password"
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
                      "Continue"
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
