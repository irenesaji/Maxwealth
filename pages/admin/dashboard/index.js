import AdminLayout from "@/layouts/adminLayout";
import Select from "react-select";
import { useState, useEffect } from "react";
import {
  getAumReport,
  getSummaryReport,
} from "@/redux/services/admin/reports/reports";
import { Spinner } from "react-bootstrap";
export default function Dashboard() {
  const [aum, setAum] = useState("");
  const [aumArr, setAumArr] = useState([]);
  const [summary, setSummary] = useState("");
  const [summaryArr, setSummaryArr] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(0);
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
    aumFunc();
    summaryFunc();
    setIsClient(true);
  }, []);

  const summaryFunc = async () => {
    try {
      const response = await getSummaryReport();
      setSummaryArr(response);
    } catch (error) {
      console.log(error);
    }
  };

  const aumFunc = async () => {
    setIsSubmitting(1);
    try {
      const response = await getAumReport();
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

    setAum(res[0][1]);
  };

  const handleSummary = async (selectedOption) => {
    let res = summaryArr?.filter((item) => {
      return item[0] == selectedOption.value;
    });
    setSummary(res[0][1]);
  };

  return (
    <>
      <AdminLayout>
        <div className="row" style={{ marginTop: "80px", minHeight: "150px" }}>
          <div
            className="col-lg-4"
            style={{
              border: "1px solid rgb(235, 234, 242)",

              fontSize: "18px",
              padding: "15px",
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
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              )
            )}

            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "150px" }}
            >
              <h1>{summary && `₹` + summary}</h1>
            </div>
          </div>
          <div
            className="col-lg-4"
            style={{
              border: "1px solid rgb(235, 234, 242)",
              marginLeft: "40px",
              padding: "15px",
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
            ) : aumArr.length != "" ? (
              <Select
                options={aumOptions}
                onChange={handleAum}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Aum type"
              />
            ) : (
              ""
            )}

            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "150px" }}
            >
              <h1>{aum && `₹` + aum}</h1>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
