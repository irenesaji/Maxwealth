import AdminLayout from "@/layouts/adminLayout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import UpdateModal from "@/components/admin/goals/update";
import { useRouter } from "next/router";
import { getTransactions } from "@/redux/services/admin/transactions/transactions";

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

  const router = useRouter();
  const [TransactionData, setTransactionData] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const columns = [
    {
      name: "Folio",
      selector: (row) => row[0],
      sortable: true,
      width: "160px",
    },
    {
      name: "Isin",
      selector: (row) => row[2],
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row[3],
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row[4],
      sortable: true,
    },

    {
      name: "Nav",
      selector: (row) => row[7],
      sortable: true,
    },

    {
      name: "Units",
      selector: (row) => row[5],
      sortable: true,
    },
    {
      name: "Traded On",
      selector: (row) => row[6],
      sortable: true,
    },
    {
      name: "Fund Type",
      selector: (row) => row[11],
      sortable: true,
    },
  ];

  const transactions = async () => {
    try {
      const response = await getTransactions();
      setTransactionData(response);
      setTotalRows(response.total);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setDomLoaded(true);
    setUser(userStore);
  }, [user]);

  useEffect(() => {
    transactions();
  }, []);

  const handlePageChange = (page) => {
    goals(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    transactions();
    setPerPage(newPerPage);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    try {
      const response = await getSearchResults(e.target.value, page, perPage);
      setAllAllocations(response.data);
      setTotalRows(response.total);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AdminLayout>
        <h2 className="mt-5 mb-5">
          <strong>Transactions</strong>
        </h2>
        <div className="row mb-5">
          <div className="col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search.."
              onChange={handleSearch}
            />
          </div>
          {/* <div className="col-lg-8 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleShow}>
              Create Allocation
            </button>
          </div> */}
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
      </AdminLayout>
    </>
  );
}
