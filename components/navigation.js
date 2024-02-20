import { ListGroup, Collapse } from "react-bootstrap";
import { getCurrentUser } from "@/redux/services/userService";
import { useEffect, useState } from "react";
import { initiateLogout } from "@/redux/services/userService";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/util/auth";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faBullseye,
  faChartSimple,
  faChevronDown,
  faCreditCard,
  faHouse,
  faLayerGroup,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  ADMIN_USERS,
  ADMIN_ALLOCATIONS,
  ADMIN_RISK_PROFILES,
  ADMIN_RISK_PROFILES_ANSWERS,
  ADMIN_RISK_PROFILES_ANSWER_WEIGHTAGE,
  ADMIN_RISK_PROFILES_QUESTIONS,
  ADMIN_GOALS,
  ADMIN_TRANSACTIONS,
  ADMIN_REDEMPTIONS,
  ADMIN_PURCHASE,
  ADMIN_DASHBOARD,
  ADMIN_REPORTS,
  ADMIN_REPORTS_CAPITAL_GAINS,
  ADMIN_REPORTS_SCHEME_WISE,
  ADMIN_REPORTS_ACCOUNT_WISE,
} from "@/util/urls";
import { getSubDomain } from "@/util/common";

export default function Navigation() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [openState, setOpenState] = useState({ 0: false, 1: false, 2: false });
  const [tenant, setTenant] = useState("");
  const toggleCollapse = (index) => {
    setOpenState((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    console.log(getSubDomain());
    setTenant(getSubDomain());
    if (tenant) {
      dispatch(getCurrentUser(tenant));
      if (!isAuthenticated()) {
        router.push("/");
      }
    }
  }, [tenant]);
  return (
    <>
      <ListGroup defaultActiveKey="#">
        <ListGroup.Item
          action
          href={ADMIN_DASHBOARD}
          active={router.pathname === ADMIN_DASHBOARD}
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faHouse} width={15} />
          &nbsp;Dashboard
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_USERS}
          active={router.pathname === ADMIN_USERS}
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faUser} width={12} />
          &nbsp;Users
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_ALLOCATIONS}
          active={router.pathname === ADMIN_ALLOCATIONS}
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faLayerGroup} width={12} />
          &nbsp;Allocations
        </ListGroup.Item>
        <ListGroup.Item
          action
          // href="#!"
          href={ADMIN_RISK_PROFILES}
          onClick={() => toggleCollapse(0)}
          style={{ position: "relative" }}
          active={
            router.pathname === ADMIN_RISK_PROFILES ||
            router.pathname === ADMIN_RISK_PROFILES_ANSWERS ||
            router.pathname === ADMIN_RISK_PROFILES_ANSWER_WEIGHTAGE ||
            router.pathname === ADMIN_RISK_PROFILES_QUESTIONS
          }
        >
          <FontAwesomeIcon icon={faAddressCard} width={12} />
          &nbsp;Risk Profiles
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_GOALS}
          active={router.pathname === ADMIN_GOALS}
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faBullseye} width={12} />
          &nbsp;Goals
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_TRANSACTIONS}
          active={
            router.pathname === ADMIN_TRANSACTIONS ||
            router.pathname === ADMIN_REDEMPTIONS ||
            router.pathname === ADMIN_PURCHASE
          }
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faCreditCard} width={12} />
          &nbsp;Transactions
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_REPORTS_ACCOUNT_WISE}
          active={
            router.pathname === ADMIN_REPORTS ||
            router.pathname === ADMIN_REPORTS_CAPITAL_GAINS ||
            router.pathname === ADMIN_REPORTS_SCHEME_WISE ||
            router.pathname === ADMIN_REPORTS_ACCOUNT_WISE
          }
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faChartSimple} width={12} />
          &nbsp;Reports
        </ListGroup.Item>
        <ListGroup.Item
          action
          onClick={() => {
            initiateLogout(router);
          }}
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faRightFromBracket} width={12} />
          &nbsp;Logout
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}
