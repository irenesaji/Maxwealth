import AdminLayout from "@/layouts/adminLayout";
import Select from "react-select";
import { useEffect, useState } from "react";
import { getAllFolios } from "@/redux/services/admin/transactions/transactions";
import { onBoarding } from "@/redux/services/admin/users/users";
import DataTable from "react-data-table-component";
import NavigationReports from "@/components/admin/reports/navigationReports";
import { Spinner } from "react-bootstrap";
import { getCapitalGainReport } from "@/redux/services/admin/reports/reports";
export default function CapitalGains() {
  const [folios, setFolios] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(0);
  const [domLoaded, setDomLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [selectedFolio, setSelectedFolio] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [btnSubmit, setBtnSubmit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [TransactionData, setTransactionData] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const columns = [
    {
      name: "Folio",
      selector: (row) => row[0],
      sortable: true,
      width: "160px",
    },
    {
      name: "Isin",
      selector: (row) => row[1],
      sortable: true,
      width: "160px",
    },
    {
      name: "Type",
      selector: (row) => row[3],
      sortable: true,
      width: "160px",
    },
    {
      name: "Amount",
      selector: (row) => "₹" + row[4],
      sortable: true,
      width: "160px",
    },
    {
      name: "Units",
      selector: (row) => row[5],
      sortable: true,
      width: "160px",
    },
    {
      name: "Traded on",
      selector: (row) => row[6],
      sortable: true,
      width: "180px",
    },
    {
      name: "Traded At",
      selector: (row) => row[7],
      sortable: true,
      width: "180px",
    },
    {
      name: "Source Days Held",
      selector: (row) => row[8],
      sortable: true,
      width: "200px",
    },
    {
      name: "Source Purchased On",
      selector: (row) => row[9],
      sortable: true,
      width: "200px",
    },
    {
      name: "Source Purchased At",
      selector: (row) => row[10],
      sortable: true,
      width: "200px",
    },
    {
      name: "Source Actual Gain",
      selector: (row) => row[11],
      sortable: true,
      width: "200px",
    },
    {
      name: "Source Taxable Gain",
      selector: (row) => row[12],
      sortable: true,
      width: "200px",
    },

    {
      name: "Scheme Name",
      selector: (row) => row[2],
      sortable: true,
      width: "400px",
    },
  ];

  useEffect(() => {
    onBoardingFunc();
    setDomLoaded(true);
  }, []);

  const onBoardingFunc = async () => {
    setIsSubmitting(1);
    try {
      const response = await onBoarding();
      setIsSubmitting(0);
      let accountsArr = [];
      response.map((res) => {
        if (
          res.fp_investment_account_id != null &&
          res.fp_investment_account_old_id != null
        ) {
          accountsArr.push({
            value: res.fp_investment_account_id,
            label: `${res.full_name}-${
              res.fp_investment_account_old_id || res.fp_investment_account_id
            }`,
          });
        }
      });

      setAccountId(accountsArr);
    } catch (error) {
      setIsSubmitting(0);
      console.log(error);
    }
  };

  const handleChangeAccount = (selectOption) => {
    setSelectedAccountId(selectOption.value);
  };

  const handleToDate = (e) => {
    setSelectedToDate(e.target.value);
  };

  const handleTransactions = async () => {
    setBtnSubmit(1);
    try {
      const response = await getCapitalGainReport(
        selectedAccountId,
        selectedFromDate,
        selectedToDate
      );
      setTransactionData(response.data.data.rows);
      setBtnSubmit(0);
    } catch (error) {
      setBtnSubmit(0);
      console.log(error);
    }
  };

  const handleFromDate = (e) => {
    setSelectedFromDate(e.target.value);
  };

  return (
    <>
      <AdminLayout>
        <NavigationReports />
        <div className="tab-body">
          <h2 className="mt-5 mb-5">
            <strong>Capital Gains Reports</strong>
          </h2>
          <div className="row">
            <div className="col-lg-4"></div>

            <div className="col-lg-2">
              <label style={{ color: "rgb(128, 128, 128)" }}>From</label>
            </div>
            <div className="col-lg-2">
              <label style={{ color: "rgb(128, 128, 128)" }}>To</label>
            </div>
          </div>
          <div className="row mb-5" style={{ minHeight: "100px" }}>
            <div className="col-lg-4">
              {isSubmitting ? (
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                  size="sm"
                />
              ) : (
                accountId && (
                  <Select
                    options={accountId}
                    onChange={handleChangeAccount}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select Investment Account"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                )
              )}

              {/* <input
              type="text"
              className="form-control"
              placeholder="Search.."
              onChange={handleSearch}
            /> */}
            </div>

            <div className="col-lg-2">
              <input
                type="date"
                className="form-control"
                style={{ minHeight: "38px", color: "hsl(0, 0%, 50%)" }}
                onChange={handleToDate}
              />
            </div>
            <div className="col-lg-2">
              <input
                type="date"
                className="form-control"
                style={{ minHeight: "38px", color: "hsl(0, 0%, 50%)" }}
                onChange={handleFromDate}
              />
            </div>
            <div className="col-lg-2">
              <button
                className="btn btn-primary"
                style={{ minHeight: "38px" }}
                onClick={handleTransactions}
                disabled={btnSubmit}
              >
                {btnSubmit ? (
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                    size="sm"
                  />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
          {domLoaded && (
            <DataTable
              columns={columns}
              data={TransactionData}
              progressPending={loading}
            />
          )}
        </div>
      </AdminLayout>
    </>
  );
}
