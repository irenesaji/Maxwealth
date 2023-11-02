import AdminLayout from "@/layouts/adminLayout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import {
  getAllPurchasePlans,
  getPurchaseList,
} from "@/redux/services/admin/transactions/transactions";
import NavigationTransactions from "@/components/admin/transactions/navigationTransactions";

export default function Purchases() {
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
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [btnSubmit, setBtnSubmit] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const typesOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "submitted", label: "Submitted" },
    { value: "successful", label: "Successful" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
    { value: "reversed", label: "Reversed" },
  ];

  const columns = [
    {
      name: "Folio",
      selector: (row) => row[4],
      sortable: true,
      width: "160px",
    },
    {
      name: "Isin",
      selector: (row) => row[11],
      sortable: true,
      width: "160px",
    },
    {
      name: "Type",
      selector: (row) => row[12],
      sortable: true,
      width: "150px",
    },
    {
      name: "Amount",
      selector: (row) => "₹" + row[6],
      sortable: true,
    },

    {
      name: "State",
      selector: (row) => row[5],
      sortable: true,
    },

    {
      name: "Alloted Units",
      selector: (row) => row[7],
      sortable: true,
      width: "150px",
    },
    {
      name: "Purchased Price",
      selector: (row) => row[9],
      sortable: true,
      width: "150px",
    },
    {
      name: "Traded On",
      selector: (row) => row.traded_on,
      sortable: true,
      width: "150px",
    },
    {
      name: "Purchased Amount",
      selector: (row) => row[8],
      sortable: true,
      width: "160px",
    },
    {
      name: "Failure Reason",
      selector: (row) => row[10],
      sortable: true,
      width: "400px",
    },
  ];

  const handleTransactions = async () => {
    setBtnSubmit(1);
    try {
      const response = await getPurchaseList(selectedPlans, selectedStatus);
      setTransactionData(response);
      setBtnSubmit(0);
    } catch (error) {
      setBtnSubmit(0);
      console.log(error);
    }
  };

  const purchaseFunc = async () => {
    setIsSubmitting(1);
    try {
      const response = await getAllPurchasePlans();
      let foliosArr = [];
      response.data.map((res) => {
        foliosArr.push({
          value: res.transaction_basket_items_fp_sip_id,
          label: `${res.user_email}-${res.transaction_basket_items_fund_isin}`,
        });
      });
      setIsSubmitting(0);
      setRedemptiom(foliosArr);
    } catch (error) {
      setIsSubmitting(0);
      console.log(error);
    }
  };

  useEffect(() => {
    setDomLoaded(true);
    setUser(userStore);
  }, [user]);

  useEffect(() => {
    purchaseFunc();
  }, []);

  const handleChangeFolio = (selectedOption) => {
    const valuesArray = selectedOption.map((item) => item.value);
    console.log(selectedOption);
    setSelectedPlans(valuesArray);
  };
  const handleChangeTypes = (selectedOption) => {
    const valuesArray = selectedOption.map((item) => item.value);
    setSelectedStatus(valuesArray);
  };

  return (
    <>
      <AdminLayout>
        <NavigationTransactions />
        <h2 className="mt-5 mb-5">
          <strong>Purchases</strong>
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
              redemption && (
                <Select
                  options={redemption}
                  onChange={handleChangeFolio}
                  isMulti
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select User"
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
              placeholder="Select Status"
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
