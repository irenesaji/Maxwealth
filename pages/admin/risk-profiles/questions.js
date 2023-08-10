import AdminLayout from "@/layouts/adminLayout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import NewModal from "@/components/admin/risk_profiles/newQuestion";
import UpdateModal from "@/components/admin/risk_profiles/updateQuestion";
import DeleteModal from "@/components/admin/risk_profiles/deleteQuestion";
import { useRouter } from "next/router";
import { ADMIN_ALLOCATIONS } from "@/util/urls";
import { getRiskProfileQuestions } from "@/redux/services/admin/risk_profiles/risk_profiles";
import Navigation from "@/components/admin/risk_profiles/navigation";

const ExpandedComponent = ({ data }) => {
  // Use the data prop to render content
  return (
    <div className="pt-5 pb-5">
      <table className="table">
        <tr>
          <td>ID:</td>
          <td>{data.id}</td>
        </tr>
        <tr>
          <td>Question:</td>
          <td>{data.question}</td>
        </tr>
        <tr>
          <td>Description:</td>
          <td>{data.description}</td>
        </tr>
        <tr>
          <td>isActive:</td>
          <td>{data.is_active ? "Yes" : "No"}</td>
        </tr>
      </table>
    </div>
  );
};

export default function Questions() {
  const userStore = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [allProfiles, setAllProfiles] = useState(null);
  const [domLoaded, setDomLoaded] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [show, setShow] = useState(false);

  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [id, setId] = useState("");
  const [selectedRisk, setSelectedRisk] = useState([]);
  const router = useRouter();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseUpdate = () => setShowUpdate(false);
  const handleShowUpdate = () => setShowUpdate(true);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Question",
      selector: (row) => row.question,
      sortable: true,
      width: "300px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      width: "300px",
    },
    {
      name: "IsActive",
      selector: (row) => <span>{row.is_active ? "Yes" : "No"}</span>,
      sortable: false,
      width: "100px",
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
    {
      name: "",
      selector: (row) => (
        <FontAwesomeIcon
          icon={faTrashAlt}
          width={10}
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => {
            handleDelete(row.id);
          }}
        />
      ),
      sortable: false,
      width: "50px",
    },
  ];

  const handleDelete = (id) => {
    setId(id);
    handleShowDelete();
  };

  const handleView = (id) => {
    handleShowView();
    const selectedRisk = allProfiles.filter((risk) => {
      return risk.id === id;
    });
    setSelectedRisk(selectedRisk);
  };

  const risk_profiles = async (currentPage, newPerPage) => {
    try {
      const response = await getRiskProfileQuestions(
        currentPage || page,
        newPerPage || perPage
      );
      setAllProfiles(response.data);
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
    risk_profiles();
  }, []);

  const handlePageChange = (page) => {
    risk_profiles(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    risk_profiles(page, newPerPage);
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

  const handleUpdate = (id) => {
    handleShowUpdate();
    const selectedRisk = allProfiles.filter((allocation) => {
      return allocation.id === id;
    });
    setId(id);
    setSelectedRisk(selectedRisk);
  };

  return (
    <>
      <AdminLayout>
        <Navigation></Navigation>
        <h2 className="mt-5 mb-5">
          <strong>Risk Profiles</strong>
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
            <button className="btn btn-primary" onClick={handleShow}>
              Create Question
            </button>
          </div>
        </div>
        {domLoaded && allProfiles && (
          <DataTable
            columns={columns}
            data={allProfiles}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            expandableRows
            // expandableRowExpanded={(row) => row.defaultExpanded}
            expandableRowsComponent={ExpandedComponent}
            expandableRowsComponentProps={{ allProfiles }}
          />
        )}

        <NewModal show={show} onHide={handleClose} />
        <DeleteModal show={showDelete} onHide={handleCloseDelete} id={id} />

        <UpdateModal
          show={showUpdate}
          onHide={handleCloseUpdate}
          risk={selectedRisk}
        />
      </AdminLayout>
    </>
  );
}
