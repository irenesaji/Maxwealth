import ListGroup from "react-bootstrap/ListGroup";
import { getCurrentUser } from "@/redux/services/userService";
import { useEffect } from "react";
import { initiateLogout } from "@/redux/services/userService";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/util/auth";
import { useDispatch } from "react-redux";
import {
  ADMIN_USERS,
  ADMIN_ALLOCATIONS,
  ADMIN_RISK_PROFILES,
} from "@/util/urls";

export default function Navigation() {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    // if (!isAuthenticated()) {
    //   router.push("/");
    // }
    // dispatch(getCurrentUser());
  }, []);
  return (
    <>
      <ListGroup defaultActiveKey="#">
        <ListGroup.Item
          action
          href={ADMIN_USERS}
          active={router.pathname === ADMIN_USERS}
        >
          Users
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_ALLOCATIONS}
          active={router.pathname === ADMIN_ALLOCATIONS}
        >
          Allocations
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_RISK_PROFILES}
          active={router.pathname === ADMIN_RISK_PROFILES}
        >
          Risk Profiles
        </ListGroup.Item>
        <ListGroup.Item
          action
          onClick={() => {
            initiateLogout(router);
          }}
        >
          Logout
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}
