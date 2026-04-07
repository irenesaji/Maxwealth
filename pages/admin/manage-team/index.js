import AdminLayout from "@/layouts/adminLayout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getUsers,
  getSearchResults,
  deleteUser,
} from "@/redux/services/admin/users/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faEye,
  faFileCsv,
  faDownload,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import UpdateModal from "@/components/admin/users/update";
import NewModal from "@/components/admin/manage_team/new";
import View from "@/components/admin/kyc/view";
import {
  getKYCAddress,
  getKYCBank,
  getKYCNominee,
  getKYCProofs,
  getKYCOnboarding,
} from "@/redux/services/admin/kyc/kyc";
import { getSubDomain } from "@/util/common";
import { CSVLink } from "react-csv";
import { Spinner, Dropdown } from "react-bootstrap";

export default function Index() {
  const userStore = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [domLoaded, setDomLoaded] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [show, setShow] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [id, setId] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [showKyc, setShowKyc] = useState(false);
  const [csvData, setCSVData] = useState([]);
  const [onboarding, setOnboarding] = useState([]);
  const [address, setAddress] = useState([]);
  const [bank, setBank] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [nominee, setNominee] = useState([]);
  const [tenant, setTenant] = useState("");
  const [loadingCSV, setLoadingCSV] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseNew = () => setShowNew(false);
  const handleShowNew = () => setShowNew(true);
  const handleCloseKyc = () => setShowKyc(false);
  const handleShowKyc = () => setShowKyc(true);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.full_name,
      sortable: true,
      width: "160px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "230px",
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "is_active",
      selector: (row) => <span>{row.is_active ? "Yes" : "No"}</span>,
      sortable: false,
    },
    {
      name: "is_blocked",
      selector: (row) => <span>{row.is_blocked ? "Yes" : "No"}</span>,
      sortable: false,
    },
    {
      name: "is_lead",
      selector: (row) => <span>{row.is_lead ? "Yes" : "No"}</span>,
      sortable: false,
    },
    {
      name: "Actions",
      selector: (row) => (
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="link"
            className="p-0 border-0 text-dark"
            style={{ boxShadow: "none" }}
          >
            <FontAwesomeIcon icon={faPenToSquare} width={15} style={{ cursor: "pointer" }} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleView(row.id)}>View</Dropdown.Item>
            <Dropdown.Item onClick={() => handleUpdate(row.id)}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={() => handleDelete(row.id)}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
      sortable: false,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const headers = [
    { label: "Name", key: "full_name" },
    { label: "Email", key: "email" },
    { label: "Mobile", key: "mobile" },
    { label: "isActive", key: "is_active" },
    { label: "isBlocked", key: "is_blocked" },
    { label: "isLead", key: "is_lead" },
  ];

  const csvDownload = async () => {
    setLoadingCSV(true);
    try {
      const response = await getUsers(1, 1000000, tenant);

      const rows = [];
      response?.data?.map((data) => {
        rows.push({
          full_name: data?.full_name,
          email: data?.email,
          mobile: data?.mobile,
          is_active: data?.is_active,
          is_blocked: data?.is_blocked,
          is_lead: data?.is_lead,
        });
      });

      setCSVData(rows);
      setLoadingCSV(false);
    } catch (error) {
      setLoadingCSV(false);
      console.log(error);
    }
  };

  const users = async (currentPage, newPerPage) => {
    try {
      const response = await getUsers(
        currentPage || page,
        newPerPage || perPage,
        tenant
      );
      setAllUsers(response.data);
      setTotalRows(response.total);
    } catch (error) {
      console.log(error);
    }
  };

  const onboardingFunc = async (id) => {
    try {
      const response = await getKYCOnboarding(id, tenant);
      setOnboarding(response?.[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const addressFunc = async (id) => {
    try {
      const response = await getKYCAddress(id, tenant);
      setAddress(response?.[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const bankFunc = async (id) => {
    try {
      const response = await getKYCBank(id, tenant);
      setBank(response?.[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const proofsFunc = async (id) => {
    try {
      const response = await getKYCProofs(id, tenant);
      setProofs(response);
    } catch (error) {
      console.log(error);
    }
  };

  const nomineeFunc = async (id) => {
    try {
      const response = await getKYCNominee(id, tenant);
      setNominee(response);
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
      users();
    }
  }, [tenant]);

  const handlePageChange = (newPage) => {
    users(newPage);
  };

  const handlePerRowsChange = async (newPerPage, newPage) => {
    setLoading(true);
    users(newPage, newPerPage);
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
      setAllUsers(response.data);
      setTotalRows(response.total);
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = (selectedId) => {
    setId(selectedId);
    onboardingFunc(selectedId);
    addressFunc(selectedId);
    bankFunc(selectedId);
    proofsFunc(selectedId);
    nomineeFunc(selectedId);
    handleShowKyc();
  };

  const handleUpdate = (selectedId) => {
    handleShow();
    const selectedUserRows = allUsers.filter((row) => {
      return row.id === selectedId;
    });
    setId(selectedId);
    setSelectedUser(selectedUserRows);
  };

  const handleDelete = async (selectedId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await deleteUser(selectedId, tenant);
      users(page, perPage);
    } catch (error) {
      console.log(error);
      alert(error?.data?.message || error?.data?.error || "Failed to delete user");
    }
  };

  return (
    <>
      <AdminLayout>
        <h2 className="mt-5 mb-5">
          <strong>Manage Team</strong>
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
          <div className="col-lg-8">
            <div className="d-flex justify-content-end">
              <button className="btn btn-primary btn-sm me-2" onClick={handleShowNew}>
                <FontAwesomeIcon icon={faPlus} width={12} />
                &nbsp;Add Staff
              </button>

              <button
                onClick={csvDownload}
                disabled={loading}
                style={{ border: "none" }}
              >
                {loadingCSV ? (
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <span className="btn btn-sm btn-secondary">
                    <FontAwesomeIcon
                      icon={faFileCsv}
                      width={15}
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                )}
              </button>

              <CSVLink
                data={csvData ? csvData : []}
                headers={headers}
                filename="manage-team.csv"
                style={{
                  marginLeft: 10,
                  display: csvData.length > 0 ? "inline" : "none",
                }}
              >
                <FontAwesomeIcon icon={faDownload} width={15} />
              </CSVLink>
            </div>
          </div>
        </div>
        {domLoaded && allUsers && (
          <DataTable
            columns={columns}
            data={allUsers}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
          />
        )}

        <View
          show={showKyc}
          onHide={handleCloseKyc}
          onboarding={onboarding}
          address={address}
          bank={bank}
          proofs={proofs}
          nominee={nominee}
        />

        <UpdateModal
          show={show}
          onHide={handleClose}
          id={id}
          user={selectedUser}
          tenant={tenant}
        />

        <NewModal show={showNew} onHide={handleCloseNew} tenant={tenant} />
      </AdminLayout>
    </>
  );
}
