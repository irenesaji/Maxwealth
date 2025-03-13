import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const BASE_URL = publicRuntimeConfig.BASE_URL;

export default function View({
  show,
  onHide,
  onboarding,
  address,
  bank,
  proofs,
  nominee,
}) {
  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          {/* <Modal.Title>{fund?.[0]?.scheme_name}</Modal.Title> */}
        </Modal.Header>

        <Modal.Body>
          <table className="table">
            <tr>
              <td>Aadhar</td>
              <td>{onboarding?.aadhaar_number}</td>
            </tr>
            <tr>
              <td>Annual Income</td>
              <td>{onboarding?.annual_income}</td>
            </tr>
            <tr>
              <td>Date of Birth</td>
              <td>
                {moment(onboarding?.date_of_birth).format("DD MMMM YYYY")}
              </td>
            </tr>
            <tr>
              <td>Father Name</td>
              <td>{onboarding?.father_name}</td>
            </tr>
            <tr>
              <td>FP Kyc Status</td>
              <td>{onboarding?.fp_kyc_status}</td>
            </tr>
            <tr>
              <td>FP Kyc Rejection Reason</td>
              <td>{onboarding?.fp_kyc_reject_reasons}</td>
            </tr>
            <tr>
              <td>Full Name</td>
              <td>{onboarding?.full_name}</td>
            </tr>
            <tr>
              <td>Kyc Compliant</td>
              <td>{onboarding?.is_kyc_compliant ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td>Marital Status</td>
              <td>{onboarding?.marital_status}</td>
            </tr>
            <tr>
              <td>Mother Name</td>
              <td>{onboarding?.mother_name}</td>
            </tr>
            <tr>
              <td>Nationality</td>
              <td>{onboarding?.nationality}</td>
            </tr>
            <tr>
              <td>Occupation</td>
              <td>{onboarding?.occupation}</td>
            </tr>
            <tr>
              <td>Pan</td>
              <td>{onboarding?.pan}</td>
            </tr>
            <tr>
              <td>Photo</td>

              <td>
                {onboarding?.photo_url ? (
                  <img
                    src={BASE_URL + "/" + onboarding?.photo_url}
                    alt=""
                    className="img-fluid"
                  />
                ) : (
                  ""
                )}
              </td>
            </tr>
            <tr>
              <td>Signature</td>

              <td>
                {onboarding?.signature_url ? (
                  <img
                    src={BASE_URL + "/" + onboarding?.signature_url}
                    alt=""
                    className="img-fluid"
                  />
                ) : (
                  ""
                )}
              </td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{onboarding?.status}</td>
            </tr>
            <tr>
              <td>Line 1</td>
              <td>{address?.line_1}</td>
            </tr>
            <tr>
              <td>Line 2</td>
              <td>{address?.line_2}</td>
            </tr>
            <tr>
              <td>Line 3</td>
              <td>{address?.line_3}</td>
            </tr>
            <tr>
              <td>City</td>
              <td>{address?.city}</td>
            </tr>
            <tr>
              <td>State</td>
              <td>{address?.state}</td>
            </tr>
          </table>
          <h5 className="mt-3 mb-3">Bank Details</h5>
          <table className="table">
            <tr>
              <td>Account Holder Name</td>
              <td>{bank?.account_holder_name}</td>
            </tr>
            <tr>
              <td>Account Number</td>
              <td>{bank?.account_number}</td>
            </tr>
            <tr>
              <td>IFSC</td>
              <td>{bank?.ifsc_code}</td>
            </tr>
            <tr>
              <td>Bank Name</td>
              <td>{bank?.bank_name}</td>
            </tr>
            <tr>
              <td>Penny drop success?</td>
              <td>{bank?.is_penny_drop_success ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td>Penny drop attempted?</td>
              <td>{bank?.is_penny_drop_attempted ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td>Primary Account?</td>
              <td>{bank?.is_primary ? "Yes" : "No"}</td>
            </tr>
          </table>
          <h5 className="mt-3 mb-3">Proofs</h5>
          <table className="table">
            <tr>
              <td>Proof Type</td>
              <td>{proofs?.[0]?.type}</td>
            </tr>
            <tr>
              <td>Document Type</td>
              <td>{proofs?.[0]?.document_type}</td>
            </tr>
            <tr>
              <td>Document Front Page</td>
              <td>
                <img
                  src={BASE_URL + "/" + proofs?.[0]?.front_document_path}
                  alt=""
                  className="img-fluid"
                />
              </td>
            </tr>
            <tr>
              <td>Document Back Page</td>
              <td>
                <img
                  src={BASE_URL + "/" + proofs?.[0]?.back_document_path}
                  alt=""
                  className="img-fluid"
                />
              </td>
            </tr>
            <tr>
              <td>Proof Type</td>
              <td>{proofs?.[1]?.type}</td>
            </tr>
            <tr>
              <td>Document Type</td>
              <td>{proofs?.[1]?.document_type}</td>
            </tr>
            <tr>
              <td>Document Front Page</td>
              <td>
                <img
                  src={BASE_URL + "/" + proofs?.[1]?.front_document_path}
                  alt=""
                  className="img-fluid"
                />
              </td>
            </tr>
            <tr>
              <td>Document Back Page</td>
              <td>
                <img
                  src={BASE_URL + "/" + proofs?.[1]?.back_document_path}
                  alt=""
                  className="img-fluid"
                />
              </td>
            </tr>
          </table>
          <h5 className="mt-3 mb-3">Nominee Details</h5>
          <table className="table">
            {nominee?.map((n) => {
              return (
                <>
                  <tr>
                    <td>Name</td>
                    <td>{n?.name}</td>
                  </tr>
                  <tr>
                    <td>Relationship</td>
                    <td>{n?.relationship}</td>
                  </tr>
                  <tr>
                    <td>Date of Birth</td>
                    <td>{moment(n?.date_of_birth).format("DD MM YYYY")}</td>
                  </tr>
                  <tr>
                    <td>Guardian Name</td>
                    <td>{n?.guardian_name}</td>
                  </tr>
                  <tr>
                    <td>Guardian Relationship</td>
                    <td>{n?.guardian_relationship}</td>
                  </tr>
                  <tr>
                    <td>Allocation</td>
                    <td>{n?.allocation_percentage} %</td>
                  </tr>
                </>
              );
            })}
          </table>
        </Modal.Body>
      </Modal>
    </>
  );
}
