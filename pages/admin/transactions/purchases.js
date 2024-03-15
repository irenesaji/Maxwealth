import AdminLayout from "@/layouts/adminLayout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { Spinner } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { useRouter } from "next/router";
import {
  getAllPurchasePlans,
  getPurchaseList,
  getPurchases
} from "@/redux/services/admin/transactions/transactions";
import NavigationTransactions from "@/components/admin/transactions/navigationTransactions";
import { getSubDomain } from "@/util/common";

import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import { CSVLink, CSVDownload } from "react-csv";
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
  const [tenant, setTenant] = useState("");
  const [csvData, setCSVData] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchases, setSelectedPurchases] = useState([]);



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

  const headers = [
    { label: "Folio", key: "folio_number" },
    { label: "Isin", key: "isin" },
    { label: "Type", key: "type" },
    { label: "Amount", key: "amount" },
    { label: "State", key: "state" },
    { label: "Alloted Units", key: "alloted_units" },
    { label: "Purchased Price", key: "purchased_price" },
    { label: "Traded On", key: "traded_on" },
    { label: "Purchased Amount", key: "purchased_amount" },
    { label: "Failure Reason", key: "failure_reason" },
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
      name: "FP Purchase ID ",
      selector: (row) => row[1],
      sortable: true,
      width: "160px",
    },
    {
      name: "FP Invesment Account ID ",
      selector: (row) => row[3],
      sortable: true,
      width: "200px",
    },
    {
      name: "Date",
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
      selector: (row) => row[16],
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
      const response = await getPurchaseList(
        selectedPlans,
        selectedStatus,
        selectedPurchases,
        tenant
      );
      setTransactionData(response);

      let csvData = [];

      response?.map((data) => {
        csvData.push({
          folio_number: data[4],
          isin: data[11],
          type: data[12],
          amount: data[6],
          state: data[5],
          alloted_units: data[7],
          purchased_price: data[9],
          traded_on: data[16],
          purchased_amount: data[8],
          failure_reason: data[10],
        });
      });

      setCSVData(csvData);

      setBtnSubmit(0);
    } catch (error) {
      setBtnSubmit(0);
      console.log(error);
    }
  };

  const purchasePlansFunc = async () => {
    setIsSubmitting(1);
    try {
      const response = await getAllPurchasePlans(tenant);
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

  const PurchasesFunc = async () => {
    setIsSubmitting(1);
    try {
      const response = await getPurchases(tenant);

      const arr=response?.map((res) => {
        return {
          value: res?.purchases_fp_id,
          label: `${res?.purchases_scheme}-${res?.user_email}`,
        }
      });

      setIsSubmitting(0);
      setPurchases(arr);
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
    setTenant(getSubDomain());
    if (tenant) {
      purchasePlansFunc();
      PurchasesFunc();

    }
  }, [tenant]);

  const handleChangeFolio = (selectedOption) => {
    const valuesArray = selectedOption.map((item) => item.value);
    console.log(selectedOption);
    setSelectedPlans(valuesArray);
  };

  const handleChangePurchases = (selectedOption) => {
    const valuesArray = selectedOption.map((item) => item.value);
    setSelectedPurchases(valuesArray);
  };

  const handleChangeTypes = (selectedOption) => {
    const valuesArray = selectedOption.map((item) => item.value);
    setSelectedStatus(valuesArray);
  };

  return (
    <>
      <AdminLayout>
        <NavigationTransactions />
        <div className="tab-body">
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
              ) :(
                purchases && <>
                  <Form.Label>Select Purchase</Form.Label>
                  <Select
                   options={purchases}
                   onChange={handleChangePurchases}
                   isMulti
                   className="basic-multi-select"
                   classNamePrefix="select"
                   placeholder="Select Purchase"
                  />
                </>
              )}
              
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
                redemption && (
                  <>
                  <Form.Label>Select User Plans</Form.Label>
                  <Select
                    options={redemption}
                    onChange={handleChangeFolio}
                    isMulti
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select User"
                  />

                  </>
                  
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
              <Form.Label>Select Status</Form.Label>
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
            <Form.Label style={{visibility:'hidden'}}>Select Status</Form.Label>
              <button
                className="btn btn-primary "
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
