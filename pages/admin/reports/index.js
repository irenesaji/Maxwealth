import AdminLayout from "@/layouts/adminLayout";
import Select from "react-select";
import { useEffect, useState } from "react";
import { getAllFolios } from "@/redux/services/admin/transactions/transactions";
import { onBoarding } from "@/redux/services/admin/users/users";
import DataTable from "react-data-table-component";
import NavigationReports from "@/components/admin/reports/navigationReports";
import { Spinner } from "react-bootstrap";
import { getHoldingReport } from "@/redux/services/admin/reports/reports";
import { getSubDomain } from "@/util/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import { CSVLink, CSVDownload } from "react-csv";
export default function Index() {
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
  const [tenant, setTenant] = useState("");
  const [csvData, setCSVData] = useState([]);

  const columns = [
    {
      name: "Folio",
      selector: (row) => row.folio_number,
      sortable: true,
      width: "160px",
    },
    {
      name: "Isin",
      selector: (row) => row.schemes[0].isin,
      sortable: true,
      width: "160px",
    },
    {
      name: "Holdings - Units",
      selector: (row) => row.schemes[0].holdings.units,
      sortable: true,
      width: "160px",
    },
    {
      name: "Holdings - As on",
      selector: (row) => row.schemes[0].holdings.as_on,
      sortable: true,
      width: "160px",
    },
    {
      name: "Market Value",
      selector: (row) => "₹" + row.schemes[0].market_value.amount,
      sortable: true,
      width: "160px",
    },

    {
      name: "Market Value - As on",
      selector: (row) => row.schemes[0].market_value.as_on,
      sortable: true,
      width: "180px",
    },

    {
      name: "Invested Value - Amount",
      selector: (row) => "₹" + row.schemes[0].invested_value.amount,
      sortable: true,
      width: "190px",
    },

    {
      name: "Invested Value - As on",
      selector: (row) => row.schemes[0].invested_value.as_on,
      sortable: true,
      width: "180px",
    },

    {
      name: "Nav",
      selector: (row) => row.schemes[0].nav.value,
      sortable: true,
    },

    {
      name: "Nav As On",
      selector: (row) => row.schemes[0].nav.as_on,
      sortable: true,
      width: "160px",
    },

    {
      name: "Payout - Amount",
      selector: (row) => "₹" + row.schemes[0].payout.amount,
      sortable: true,
      width: "160px",
    },

    {
      name: "Payout - As on",
      selector: (row) => row.schemes[0].payout.as_on,
      sortable: true,
      width: "160px",
    },

    {
      name: "Scheme Name",
      selector: (row) => row.schemes[0].name,
      sortable: true,
      width: "400px",
    },
  ];

  const headers = [
    { label: "Folio", key: "folio_number" },
    { label: "Isin", key: "isin" },
    { label: "Holdings - Units", key: "holdings_units" },
    { label: "Holdings - As on", key: "holdings_as_on" },
    { label: "Market Value", key: "market_value_amount" },
    { label: "Market Value - As on", key: "market_value_as_on" },
    { label: "Invested Value - As on", key: "invested_value_amount" },
    { label: "Nav - As on", key: "nav_as_on" },
    { label: "Payout - Amount", key: "payout_amount" },
    { label: "Payout - As on", key: "payout_as_on" },
    { label: "Scheme Name", key: "name" },
  ];

  useEffect(() => {
    setTenant(getSubDomain());
    if (tenant) {
      foliosFunc();
      onBoardingFunc();
    }
    setDomLoaded(true);
  }, [tenant]);

  const foliosFunc = async () => {
    setIsSubmitting(1);
    try {
      const response = await getAllFolios(tenant);
      setIsSubmitting(0);
      let foliosArr = [];
      response.data.map((res) => {
        foliosArr.push({
          value: res.transaction_basket_items_folio_number,
          label: `${res.user_email}-${res.transaction_basket_items_folio_number}`,
        });
      });
      setFolios(foliosArr);
    } catch (error) {
      setIsSubmitting(0);
      console.log(error);
    }
  };

  const onBoardingFunc = async () => {
    setIsSubmitting(1);
    try {
      const response = await onBoarding(tenant);
      setIsSubmitting(0);
      let accountsArr = [];
      response.map((res) => {
        if (
          res.fp_investment_account_id != null &&
          res.fp_investment_account_old_id != null
        ) {
          accountsArr.push({
            value:
              res.fp_investment_account_old_id || res.fp_investment_account_id,
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

  const handleChangeFolio = (selectedOption) => {
    const values = selectedOption.map((item) => item.value).join(",");
    setSelectedFolio(values);
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
      const response = await getHoldingReport(
        selectedAccountId,
        selectedFolio,
        selectedToDate,
        tenant
      );

      setTransactionData(response.data.folios);
      setBtnSubmit(0);

      let csvData = [];

      response?.data?.folios?.map((data) => {
        csvData.push({
          folio_number: data?.folio_number,
          isin: data?.schemes[0]?.isin,
          holdings_units: data?.schemes[0]?.holdings?.units,
          holdings_as_on: data?.schemes[0]?.holdings.as_on,
          market_value_amount: data?.schemes[0]?.market_value.amount,
          market_value_as_on: data?.schemes[0]?.market_value.as_on,
          invested_value_amount: data?.schemes[0]?.invested_value.amount,
          invested_value_as_on: data?.schemes[0]?.invested_value.as_on,
          nav_value: data?.schemes[0]?.nav.value,
          nav_as_on: data?.schemes[0]?.nav.as_on,
          payout_amount: data?.schemes[0]?.payout.amount,
          payout_as_on: data?.schemes[0]?.payout.as_on,
          name: data?.schemes[0]?.name,
        });
      });

      setCSVData(csvData);
    } catch (error) {
      setBtnSubmit(0);
      console.log(error);
    }
  };

  return (
    <>
      <AdminLayout>
        <NavigationReports />
        <div className="tab-body">
          <h2 className="mt-5 mb-5">
            <strong>Holdings Reports</strong>
          </h2>
          <div className="row">
            <div className="col-lg-3"></div>
            <div className="col-lg-8"></div>
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
            <div className="col-lg-3">
              {isSubmitting ? (
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                  size="sm"
                />
              ) : (
                folios && (
                  <Select
                    options={folios}
                    onChange={handleChangeFolio}
                    isMulti
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select Folio"
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
            <>
              <div className="d-flex justify-content-end">
                <CSVLink
                  data={csvData ? csvData : []}
                  headers={headers}
                  filename="holdings-report.csv"
                >
                  <span className="btn btn-sm btn-secondary">
                    <FontAwesomeIcon
                      icon={faFileCsv}
                      width={15}
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                </CSVLink>
              </div>
              <DataTable
                columns={columns}
                data={TransactionData}
                progressPending={loading}
              />
            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
