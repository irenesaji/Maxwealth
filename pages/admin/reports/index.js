import AdminLayout from "@/layouts/adminLayout";
import Select from "react-select";
import { useEffect, useState } from "react";
import { getAllFolios } from "@/redux/services/admin/transactions/transactions";
import { onBoarding } from "@/redux/services/admin/users/users";
import DataTable from "react-data-table-component";
import NavigationReports from "@/components/admin/reports/navigationReports";
import { Spinner } from "react-bootstrap";
import { getHoldingReport } from "@/redux/services/admin/reports/reports";
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

  useEffect(() => {
    foliosFunc();
    onBoardingFunc();
    setDomLoaded(true);
  }, []);

  const foliosFunc = async () => {
    setIsSubmitting(1);
    try {
      const response = await getAllFolios();
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
      const response = await onBoarding();
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
        selectedToDate
      );

      setTransactionData(response.data.folios);
      setBtnSubmit(0);
    } catch (error) {
      setBtnSubmit(0);
      console.log(error);
    }
  };

  return (
    <>
      <AdminLayout>
        <NavigationReports />
        <h2 className="mt-5 mb-5">
          <strong>Holdings Reports</strong>
        </h2>
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-4"></div>
          <div className="col-lg-2">
            <label style={{ color: "rgb(128, 128, 128)" }}>To</label>
          </div>
        </div>
        <div className="row mb-5" style={{ minHeight: "100px" }}>
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
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
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
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
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
          <DataTable
            columns={columns}
            data={TransactionData}
            progressPending={loading}
          />
        )}
      </AdminLayout>
    </>
  );
}
