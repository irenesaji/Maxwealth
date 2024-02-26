import AdminLayout from "@/layouts/adminLayout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrashAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import NewModal from "@/components/admin/risk_profiles/newAnswer";
import UpdateModal from "@/components/admin/risk_profiles/updateAnswer";
import DeleteModal from "@/components/admin/risk_profiles/deleteAnswer";
import { useRouter } from "next/router";
import { ADMIN_ALLOCATIONS } from "@/util/urls";
import {
  getRiskProfileQuestions,
  getRiskProfileAnswerChoices,
  getRiskProfileAnswerWeightage,
} from "@/redux/services/admin/risk_profiles/risk_profiles";
import Navigation from "@/components/admin/risk_profiles/navigation";
import { getSubDomain } from "@/util/common";
export default function Answers() {
  const userStore = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [allProfiles, setAllProfiles] = useState(null);
  const [domLoaded, setDomLoaded] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [show, setShow] = useState(false);
  const [allQuestions, setAllQuestions] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [id, setId] = useState("");
  const [selectedRisk, setSelectedRisk] = useState([]);
  const [weightageData, setWeightageData] = useState([]);
  const router = useRouter();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [tenant, setTenant] = useState("");
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
      selector: (row) => {
        return getQuestionName(row.risk_profile_question_id);
      },
      sortable: true,
      width: "400px",
    },
    {
      name: "Weightage",
      selector: (row) => {
        const selectedWeightage = weightageData.filter(
          (weightage) => weightage.id === row.risk_answer_weightage_id
        );
        return selectedWeightage ? selectedWeightage[0].weightage : "N/A";
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Answer",
      selector: (row) => row.answer,
      sortable: false,
      width: "300px",
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

  const risk_profiles = async (currentPage, newPerPage, id) => {
    try {
      const response = await getRiskProfileAnswerChoices(
        currentPage || page,
        newPerPage || perPage,
        id,
        tenant
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
    // risk_profiles();
    setTenant(getSubDomain());
    if (tenant) {
      getQuestions();
      getWeightage();
    }
  }, [tenant]);

  const handlePageChange = (page) => {
    risk_profiles(page);
    getQuestions();
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    risk_profiles(page, newPerPage);
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
    const selectedRisk = allProfiles.filter((allocation) => {
      return allocation.id === id;
    });
    setId(id);
    setSelectedRisk(selectedRisk);
  };

  const getQuestions = async () => {
    const response = await getRiskProfileQuestions(1, 1000, tenant);

    setAllQuestions(response.data);
  };

  const getQuestionName = (id) => {
    const selectedQuestion = allQuestions.filter((question) => {
      return question.id === id;
    });

    return selectedQuestion[0]["question"];
  };

  const getWeightage = async (id) => {
    try {
      const response = await getRiskProfileAnswerWeightage(1, 1000, tenant);

      setWeightageData(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <>
      <AdminLayout>
        <Navigation></Navigation>
        <h2 className="mt-5 mb-5">
          <strong>Answers</strong>
        </h2>

        <div className="row mb-5">
          <div className="col-lg-4">
            <select
              className="form-control"
              onChange={(e) => {
                risk_profiles(page, perPage, e.target.value);
              }}
            >
              <option selected disabled>
                Select an option
              </option>
              {allQuestions &&
                allQuestions.map((question) => {
                  return (
                    <option key={question.id} value={question.id}>
                      {question.question}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="col-lg-8 d-flex justify-content-end">
            <button className="btn btn-primary btn-sm" onClick={handleShow}>
              <FontAwesomeIcon icon={faPlus} width={12} />
              &nbsp; Create
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
            // expandableRows
            // // expandableRowExpanded={(row) => row.defaultExpanded}
            // expandableRowsComponent={ExpandedComponent}
            // expandableRowsComponentProps={{ allProfiles }}
          />
        )}

        <NewModal
          show={show}
          onHide={handleClose}
          questions={allQuestions}
          weightages={weightageData}
          tenant={tenant}
        />
        <DeleteModal
          show={showDelete}
          onHide={handleCloseDelete}
          id={id}
          tenant={tenant}
        />

        <UpdateModal
          show={showUpdate}
          onHide={handleCloseUpdate}
          questions={allQuestions}
          weightages={weightageData}
          risk={selectedRisk}
          tenant={tenant}
        />
      </AdminLayout>
    </>
  );
}
