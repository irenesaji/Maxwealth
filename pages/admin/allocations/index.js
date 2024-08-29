import AdminLayout from "@/layouts/adminLayout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faPlus,
  faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import NewModal from "@/components/admin/model_portfolios/new";
import UpdateModal from "@/components/admin/allocations/update";
import {
  getAllocations,
  createAllocation,
  getSearchResults,
  deleteAllocation,
} from "@/redux/services/admin/allocations/allocations";
import { useRouter } from "next/router";
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
  const [showUpdate, setShowUpdate] = useState(false);
  const [id, setId] = useState("");
  const [selectedAllocation, setSelectedAllocation] = useState([]);
  const router = useRouter();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseUpdate = () => setShowUpdate(false);
  const handleShowUpdate = () => setShowUpdate(true);
  const [tenant, setTenant] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);


  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
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
    {
      name: "",
      selector: (row) => (
        <FontAwesomeIcon
          icon={faPenToSquare}
          width={15}
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleUpdate(row.id);
          }}
        />
      ),
      sortable: false,
    },
    // {
    //   name: "",
    //   selector: (row) => (
    //     <FontAwesomeIcon
    //       icon={faTrashAlt}
    //       width={12}
    //       style={{ cursor: "pointer", color: "red" }}
    //       onClick={() => {
    //         handleUpdate(row.id);
    //       }}
    //     />
    //   ),
    //   sortable: false,
    // },
  ];

  const handleView = (id) => {
    router.push({
      pathname: `${ADMIN_ALLOCATIONS}/${id}`,
    });
  };

  const allocations = async (currentPage, newPerPage) => {
    try {
      const response = await getAllocations(
        currentPage || page,
        newPerPage || perPage,
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

  useEffect(() => {
    setTenant(getSubDomain());
    if (tenant) {
      allocations();
    }
  }, [tenant]);

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
      const response = await getSearchResults(
        e.target.value,
        page,
        perPage,
        tenant
      );
      setAllAllocations(response.data);
      setTotalRows(response.total);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = (id) => {
    handleShowUpdate();
    const selectedAllocation = allAllocations.filter((allocation) => {
      return allocation.id === id;
    });

    setId(id);
    setSelectedAllocation(selectedAllocation);
  };

  // confirmation modal logic
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleDelete=(rowData)=>{
    setSelectedRecord(rowData);
    handleOpenConfirmationModal();
  }
  
  const handleOpenConfirmationModal=()=>{
    setShowConfirmationModal(true);
  }

  const handleCloseConfirmationModal=()=>{
    setShowConfirmationModal(false);
  }

  const handleOnProceed=()=>{
    
    deleteAllocation(selectedRecord.id,tenant)
    .then(res=>{
      setShowConfirmationModal(false);
      location.reload()
    }).catch((err)=>{
      console.log(err)
    })
    // .then((res)=>{
    //   console.log(res)
    // })
  }

  return (
    <>
      <AdminLayout>
        <h2 className="mt-5 mb-5">
          <strong>Allocations</strong>
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
          <div className="col-lg-8 d-flex justify-content-end">
            <button className="btn btn-primary btn-sm" onClick={handleShow}>
              <FontAwesomeIcon icon={faPlus} width={12} />
              &nbsp; Create
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

        <NewModal show={show} onHide={handleClose} tenant={tenant} />
        <ConfirmationModal show={showConfirmationModal} onHide={handleCloseConfirmationModal} onProceed={handleOnProceed}/>

        <UpdateModal
          show={showUpdate}
          onHide={handleCloseUpdate}
          id={id}
          allocations={selectedAllocation}
          tenant={tenant}
        />
      </AdminLayout>
    </>
  );
}
