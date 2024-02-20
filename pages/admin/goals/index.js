import AdminLayout from "@/layouts/adminLayout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import UpdateModal from "@/components/admin/goals/update";
import { getAllocations } from "@/redux/services/admin/allocations/allocations";
import { getGoals } from "@/redux/services/admin/goals/goals";
import { useRouter } from "next/router";
import { ADMIN_ALLOCATIONS } from "@/util/urls";
import { getSubDomain } from "@/util/common";
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
  const [selectedAllocation, setSelectedAllocation] = useState([]);
  const router = useRouter();
  const [allocationData, setAllocationData] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [tenant, setTenant] = useState("");

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
      name: "Icon",
      selector: (row) => <img src={row.icon} width="40" />,
      sortable: true,
    },
    {
      name: "Model Portfolio",
      selector: (row) => {
        const selectedAllocation = allocationData.filter(
          (allocation) => allocation.id === row.model_portfolio_id
        );

        return selectedAllocation ? selectedAllocation[0]?.name : "N/A";
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "",
      selector: (row) => (
        <FontAwesomeIcon
          icon={faPenToSquare}
          width={12}
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleUpdate(row.id);
          }}
        />
      ),
      sortable: false,
      width: "50px",
    },
  ];

  const goals = async (currentPage, newPerPage) => {
    try {
      const response = await getGoals(
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
      goals();
      getAllocationsData();
    }
  }, [tenant]);

  const handlePageChange = (page) => {
    goals(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    goals(page, newPerPage);
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
    handleShow();
    const selectedAllocation = allAllocations.filter((allocation) => {
      return allocation.id === id;
    });
    setId(id);
    setSelectedAllocation(selectedAllocation);
  };

  const getAllocationsData = async () => {
    try {
      const response = await getAllocations(tenant);
      setAllocationData(response);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <>
      <AdminLayout>
        <h2 className="mt-5 mb-5">
          <strong>Goals</strong>
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

        <UpdateModal
          show={show}
          onHide={handleClose}
          allocationData={allocationData}
          goals={allAllocations}
          tenant={tenant}
        />
      </AdminLayout>
    </>
  );
}
