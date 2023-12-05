import ListGroup from "react-bootstrap/ListGroup";
import { getCurrentUser } from "@/redux/services/userService";
import { useEffect } from "react";
import { initiateLogout } from "@/redux/services/userService";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/util/auth";
import { useDispatch } from "react-redux";
import {
  ADMIN_REDEMPTIONS,
  ADMIN_PURCHASE,
  ADMIN_REPORTS,
  ADMIN_REPORTS_CAPITAL_GAINS,
  ADMIN_REPORTS_SCHEME_WISE,
  ADMIN_REPORTS_ACCOUNT_WISE,
} from "@/util/urls";

export default function NavigationReports() {
  const router = useRouter();

  return (
    <>
      <ListGroup defaultActiveKey="#" horizontal className="mb-5 mt-5">
        <ListGroup.Item
          action
          href={ADMIN_REPORTS_ACCOUNT_WISE}
          active={router.pathname === ADMIN_REPORTS_ACCOUNT_WISE}
        >
          Account Wise
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_REPORTS_SCHEME_WISE}
          active={router.pathname === ADMIN_REPORTS_SCHEME_WISE}
        >
          Scheme Wise
        </ListGroup.Item>

        <ListGroup.Item
          action
          href={ADMIN_REPORTS}
          active={router.pathname === ADMIN_REPORTS}
        >
          Holdings
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_REPORTS_CAPITAL_GAINS}
          active={router.pathname === ADMIN_REPORTS_CAPITAL_GAINS}
        >
          Capital Gains
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}
