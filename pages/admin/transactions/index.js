import AdminLayout from "@/layouts/adminLayout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";
import {
  getTransactions,
  getAllFolios,
  getAllRedemptionPlans,
} from "@/redux/services/admin/transactions/transactions";
import NavigationTransactions from "@/components/admin/transactions/navigationTransactions";

export default function Index() {
  const userStore = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [allAllocations, setAllAllocations] = useState(null);
  const [domLoaded, setDomLoaded] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [folios, setFolios] = useState("");
  const [redemption, setRedemptiom] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(0);
  const router = useRouter();
  const [TransactionData, setTransactionData] = useState([]);
  const [selectedFolio, setSelectedFolio] = useState("");
  const [selectedTypes, setSelectedTypes] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [btnSubmit, setBtnSubmit] = useState(0);

  const typesOptions = [
    { value: "purchase", label: "Purchase" },
    { value: "redemption", label: "Redemption" },
    { value: "switch_in", label: "Switch In" },
    { value: "switch_out", label: "Switch Out" },
    { value: "transfer_in", label: "Transfer In" },
    { value: "transfer_out", label: "Transfer Out" },
    { value: "dividend_payout", label: "Dividend Payout" },
    { value: "dividend_reinvestment", label: "Dividend Reinvestment" },
    { value: "bonus", label: "Bonus" },
  ];

  const columns = [
    {
      name: "Folio",
      selector: (row) => row.folio_number,
      sortable: true,
      width: "160px",
    },
    {
      name: "Isin",
      selector: (row) => row.isin,
      sortable: true,
      width: "160px",
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => "₹" + row.amount,
      sortable: true,
    },

    {
      name: "Nav",
      selector: (row) => row.traded_at,
      sortable: true,
    },

    {
      name: "Units",
      selector: (row) => row.units,
      sortable: true,
    },
    {
      name: "Traded On",
      selector: (row) => row.traded_on,
      sortable: true,
      width: "150px",
    },
    {
      name: "Fund Type",
      selector: (row) => row.rta_investment_option,
      sortable: true,
      width: "150px",
    },
    {
      name: "Scheme Name",
      selector: (row) => row.rta_scheme_name,
      sortable: true,
      width: "400px",
    },
  ];

  const handleTransactions = async () => {
    setBtnSubmit(1);
    try {
      const response = await getTransactions(
        selectedFolio,
        selectedTypes,
        selectedFromDate,
        selectedToDate
      );
      setTransactionData(response.data.data);
      setBtnSubmit(0);
    } catch (error) {
      setBtnSubmit(0);
      console.log(error);
    }
  };

  const foliosFunc = async () => {
    setIsSubmitting(1);
    try {
      const response = await getAllFolios();
      let foliosArr = [];
      response.data.map((res) => {
        foliosArr.push({
          value: res.transaction_basket_items_folio_number,
          label: `${res.user_email}-${res.transaction_basket_items_folio_number}`,
        });
      });
      setFolios(foliosArr);
      setIsSubmitting(0);
    } catch (error) {
      setIsSubmitting(0);
      console.log(error);
    }
  };

  const redemptionFunc = async () => {
    try {
      const response = await getAllRedemptionPlans();
      console.log(response.data);
      setRedemptiom(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setDomLoaded(true);
    setUser(userStore);
  }, [user]);

  useEffect(() => {
    foliosFunc();
    // redemptionFunc();
  }, []);

  const handlePageChange = (page) => {
    transactions(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    transactions(page, newPerPage);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const handleChangeFolio = (selectedOption) => {
    const values = selectedOption.map((item) => item.value).join(",");
    setSelectedFolio(values);
  };
  const handleChangeTypes = (selectedOption) => {
    const values = selectedOption.map((item) => item.value).join(",");
    setSelectedTypes(values);
  };
  const handleFromDate = (e) => {
    setSelectedFromDate(e.target.value);
  };
  const handleToDate = (e) => {
    setSelectedToDate(e.target.value);
  };

  return (
    <>
      <AdminLayout>
        <NavigationTransactions />
        <div className="tab-body">
          <h2 className="mt-5 mb-5">
            <strong>Transactions</strong>
          </h2>

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
              <Select
                options={typesOptions}
                onChange={handleChangeTypes}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Types"
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
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
            />
          )}
        </div>
      </AdminLayout>
    </>
  );
}
