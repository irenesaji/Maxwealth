import AdminLayout from "@/layouts/adminLayout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEye,faTrashCan } from "@fortawesome/free-solid-svg-icons";
import NewModal from "@/components/admin/funds/new";
import ViewModal from "@/components/admin/funds/view";
import {
  deleteFund,
  getFunds,
  getSearchResults,
} from "@/redux/services/admin/allocations/funds";
import { useRouter } from "next/router";
import Link from "next/link";
import { ADMIN_ALLOCATIONS } from "@/util/urls";
import { getSubDomain } from "@/util/common";
import ConfirmationModal from "@/components/admin/allocations/confirmationModal";
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
  const [showView, setShowView] = useState(false);
  const [id, setId] = useState("");
  const [selectedAllocation, setSelectedAllocation] = useState([]);
  const router = useRouter();
  const [allocationId, setAllocationId] = useState(null);
  const [tenant, setTenant] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseView = () => setShowView(false);
  const handleShowView = () => setShowView(true);

  useEffect(() => {
    setTenant(getSubDomain());
  }, [tenant]);
  useEffect(() => {
    setAllocationId(router.query.id);
    allocationId ? allocations() : "";
  }, [allocationId, router]);

  const columns = [
    {
      name: "ISIN",
      selector: (row) => row.scheme_isin,
      sortable: true,
    },
    {
      name: "Scheme Name",
      selector: (row) => row.scheme_name,
      sortable: true,
    },
    {
      name: "Scheme Category",
      selector: (row) => row.scheme_category,
      sortable: true,
    },
    {
      name: "Scheme Asset Class",
      selector: (row) => row.scheme_asset_class,
      sortable: true,
    },
    {
      name: "",
      selector: (row) => (
        <>
        <a
          href="javascript:void(0);"
          onClick={() => {
            handleView(row.id);
          }}
        >
          <FontAwesomeIcon
            icon={faEye}
            width={12}
            style={{ cursor: "pointer" }}
          />
        </a>

          <a
          className="ms-2"
          href="javascript:void(0);"
          onClick={() => {
            handleDelete(row)
          }}
          >
          <FontAwesomeIcon
            icon={faTrashCan}
            width={10}
            style={{ cursor: "pointer" }}
          />
          </a>
        
        </>
        
      ),
      sortable: false,
    },
  ];

  const allocations = async (currentPage, newPerPage) => {
    try {
      const response = await getFunds(
        currentPage || page,
        newPerPage || perPage,
        allocationId,
        tenant
      );
      setAllAllocations(response.data);
      setTotalRows(response.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setDomLoaded(true);
    setUser(userStore);
  }, [user]);

  const handlePageChange = (page) => {
    allocations(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    allocations(page, newPerPage);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    try {
      const response = await getSearchResults(e.target.value, tenant);
      setAllAllocations(response.data.data);
      setTotalRows(response.total);
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = (id) => {
    handleShowView();
    const selectedAllocation = allAllocations.filter((fund) => {
      return fund.id === id;
    });
    setSelectedAllocation(selectedAllocation);
  };

  // confirmation modal logic
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const handleDelete=(rowData)=>{
    setSelectedRecord(rowData);
    handleOpenConfirmationModal();
  }
  
  const handleOpenConfirmationModal=()=>{
    setShowConfirmationModal(true);
  }

  const handleCloseConfirmationModal=()=>{
    setShowConfirmationModal(false);
    setSelectedRecord(null);
  }

  const handleOnProceed=()=>{
    deleteFund(selectedRecord.id,tenant).then((res)=>{
      setShowConfirmationModal(false);
      location.reload()
    }).catch((err)=>{
      console.log(err)
    })
  }

  return (
    <>
      <AdminLayout>
        <h2 className="mt-5 mb-5">
          <Link href={ADMIN_ALLOCATIONS}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              width={12}
              style={{ cursor: "pointer", color: "black" }}
            />
          </Link>{" "}
          <strong>Model Portfolio Funds</strong>
        </h2>
        <div className="row mb-5">
          <div className="col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search By Scheme Name.."
              onChange={handleSearch}
            />
          </div>
          <div className="col-lg-8 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleShow}>
              Create Fund
            </button>
          </div>
        </div>
        {domLoaded && allAllocations && (
          <DataTable
            columns={columns}
            data={allAllocations}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
          />
        )}

        <NewModal
          show={show}
          onHide={handleClose}
          allocationId={allocationId}
          tenant={tenant}
        />

        <ViewModal
          show={showView}
          onHide={handleCloseView}
          fund={selectedAllocation}
          tenant={tenant}
        />
      </AdminLayout>
      <ConfirmationModal show={showConfirmationModal} onHide={handleCloseConfirmationModal} onProceed={handleOnProceed}/>
    </>
  );
}
