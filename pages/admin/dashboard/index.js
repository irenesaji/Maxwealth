import AdminLayout from "@/layouts/adminLayout";
import Select from "react-select";
import { useState, useEffect } from "react";
import {
  getAumReport,
  getSummaryReport,
} from "@/redux/services/admin/reports/reports";
import { getUsers } from "@/redux/services/admin/users/users";
import { Spinner } from "react-bootstrap";
import { getSubDomain } from "@/util/common";
export default function Dashboard() {
  const [aum, setAum] = useState("");
  const [aumArr, setAumArr] = useState([]);
  const [summary, setSummary] = useState("");
  const [summaryArr, setSummaryArr] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(0);
  const [tenant, setTenant] = useState("");
  const [totalAum, setTotalAum] = useState(null);
  const [totalRows, setTotalRows] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const summaryOptions = [
    {
      value: "redemption",
      label: "Redemption",
    },
    {
      value: "switch_out",
      label: "Switch Out",
    },
    {
      value: "purchase",
      label: "Purchase",
    },
    {
      value: "transfer_in",
      label: "Transfer In",
    },
    {
      value: "switch_in",
      label: "Switch In",
    },
    {
      value: "dividend_payout",
      label: "Dividend Payout",
    },
    {
      value: "sip",
      label: "SIP",
    },
  ];
  const aumOptions = [
    {
      value: "equity",
      label: "Equity",
    },
    {
      value: "debt",
      label: "Debt",
    },
  ];

  useEffect(() => {
    setTenant(getSubDomain());
  }, [tenant]);

  useEffect(() => {
    if (tenant) {
      aumFunc();
      summaryFunc();
      users();
    }
    setIsClient(true);
  }, [tenant]);

  const users = async (currentPage, newPerPage) => {
    try {
      const response = await getUsers(
        currentPage || page,
        newPerPage || perPage,
        tenant
      );
      console.log(response.total);
      setTotalRows(response.total);
    } catch (error) {
      console.log(error);
    }
  };

  const summaryFunc = async () => {
    try {
      const response = await getSummaryReport(tenant);
      setSummaryArr(response);
      // console.log(response?.[1]?.[1]);
      // if (response?.[0]?.[0] == "purchase" && response?.[2]?.[0] == "sip") {
      //   setTotalAum(response?.[0]?.[1] + response?.[2]?.[1]);
      // }
      // Dynamically find purchase and sip regardless of position:
      const purchaseValue = response.find(item => item[0] === "purchase")?.[1] || 0;
      const sipValue = response.find(item => item[0] === "sip")?.[1] || 0;
      setTotalAum(purchaseValue + sipValue);

      // if (purchaseEntry && sipEntry) {
      //   const totalAum = purchaseEntry[1] + sipEntry[1];
      //   setTotalAum(totalAum);
      // } else {
      //   // Optionally, you could reset or handle if not both found:
      //   setTotalAum(0);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const aumFunc = async () => {
    setIsSubmitting(1);
    try {
      const response = await getAumReport(tenant);
      setAumArr(response);
      setIsSubmitting(0);
    } catch (error) {
      setIsSubmitting(0);
      console.log(error);
    }
  };

  const handleAum = async (selectedOption) => {
    let res = aumArr?.filter((item) => {
      return item[0] == selectedOption.value;
    });

    setAum(res?.[0]?.[1]);
  };

  const handleSummary = async (selectedOption) => {
    let res = summaryArr?.filter((item) => {
      return item[0] == selectedOption.value;
    });
    setSummary(res?.[0]?.[1]);
  };

  return (
    <>
      <AdminLayout>
        <div className="row" style={{ marginTop: "80px", minHeight: "150px" }}>
          <div className="col-lg-3">
            <div
              className=""
              style={{
                padding: "15px",
                background: "green",
                color: "white",
                minHeight: "255px",
                borderRadius: "10px",
              }}
            >
              <h4 className="mb-3" style={{ fontSize: "18px" }}>
                Transactions Summary
              </h4>
              {isSubmitting ? (
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                  size="sm"
                />
              ) : (
                isClient &&
                summaryArr.length != "" && (
                  <Select
                    options={summaryOptions}
                    onChange={handleSummary}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select Types"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                )
              )}

              <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "150px" }}
              >
                <h2>
                  {summary &&
                    `₹` + new Intl.NumberFormat("en-IN").format(summary)}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div
              className="c"
              style={{
                padding: "15px",
                background: "purple",
                color: "white",
                minHeight: "255px",
                borderRadius: "10px",
              }}
            >
              <h4 className="mb-3" style={{ fontSize: "18px" }}>
                AUM Summary
              </h4>
              {isSubmitting ? (
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                  size="sm"
                />
              ) : aumArr?.length != "" ? (
                <Select
                  options={aumOptions}
                  onChange={handleAum}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select Aum type"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              ) : (
                ""
              )}

              <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "150px" }}
              >
                <h2>
                  {aum && `₹` + new Intl.NumberFormat("en-IN").format(aum)}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div
              style={{
                padding: "15px",
                background: "grey",
                color: "white",
                minHeight: "255px",
                borderRadius: "10px",
              }}
            >
              <h4 className="mb-3" style={{ fontSize: "18px" }}>
                Total Aum Managed
              </h4>

              <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "180px" }}
              >
                {isSubmitting ? (
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                    size="sm"
                  />
                ) : aumArr?.length != "" ? (
                  <h2>
                    {totalAum &&
                      `₹` + new Intl.NumberFormat("en-IN").format(totalAum)}
                  </h2>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-3">
            <div
              style={{
                padding: "15px",
                background: "darkblue",
                color: "white",
                minHeight: "255px",
                borderRadius: "10px",
              }}
            >
              <h4 className="mb-3" style={{ fontSize: "18px" }}>
                Total Investors
              </h4>

              <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "180px" }}
              >
                {isSubmitting ? (
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                    size="sm"
                  />
                ) : aumArr?.length != "" ? (
                  <h2>{new Intl.NumberFormat("en-IN").format(totalRows)}</h2>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
