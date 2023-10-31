import ListGroup from "react-bootstrap/ListGroup";
import { getCurrentUser } from "@/redux/services/userService";
import { useEffect } from "react";
import { initiateLogout } from "@/redux/services/userService";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/util/auth";
import { useDispatch } from "react-redux";
import {
  ADMIN_TRANSACTIONS,
  ADMIN_REDEMPTIONS,
  ADMIN_PURCHASE,
} from "@/util/urls";

export default function NavigationTransactions() {
  const router = useRouter();

  return (
    <>
      <ListGroup defaultActiveKey="#" horizontal className="mb-5 mt-5">
        <ListGroup.Item
          action
          href={ADMIN_TRANSACTIONS}
          active={router.pathname === ADMIN_TRANSACTIONS}
        >
          Folios
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_REDEMPTIONS}
          active={router.pathname === ADMIN_REDEMPTIONS}
        >
          Redemption List
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_PURCHASE}
          active={router.pathname === ADMIN_PURCHASE}
        >
          Purchase List
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}
