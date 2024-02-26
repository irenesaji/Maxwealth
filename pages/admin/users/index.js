import AdminLayout from "@/layouts/adminLayout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUsers, getSearchResults } from "@/redux/services/admin/users/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faEye } from "@fortawesome/free-solid-svg-icons";
import UpdateModal from "@/components/admin/users/update";
import View from "@/components/admin/kyc/view";
import {
  getKYCAddress,
  getKYCBank,
  getKYCNominee,
  getKYCProofs,
  getKYCOnboarding,
} from "@/redux/services/admin/kyc/kyc";
import { getSubDomain } from "@/util/common";
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
  const [id, setId] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [showKyc, setShowKyc] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseKyc = () => setShowKyc(false);
  const handleShowKyc = () => setShowKyc(true);
  const [onboarding, setOnboarding] = useState([]);
  const [address, setAddress] = useState([]);
  const [bank, setBank] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [nominee, setNominee] = useState([]);
  const [tenant, setTenant] = useState("");

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
      name: "Kyc Details",
      selector: (row) => (
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
  ];

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

  const handlePageChange = (page) => {
    users(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    users(page, newPerPage);
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

  const handleView = (id) => {
    setId(id);
    onboardingFunc(id);
    addressFunc(id);
    bankFunc(id);
    proofsFunc(id);
    nomineeFunc(id);
    handleShowKyc();
  };

  const handleUpdate = (id) => {
    handleShow();
    const selectedUser = allUsers.filter((user) => {
      return user.id === id;
    });
    setId(id);
    setSelectedUser(selectedUser);
  };

  return (
    <>
      <AdminLayout>
        <h2 className="mt-5 mb-5">
          <strong>Users</strong>
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
          <div className="col-lg-4"></div>
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
      </AdminLayout>
    </>
  );
}
