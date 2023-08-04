import ListGroup from "react-bootstrap/ListGroup";
import { getCurrentUser } from "@/redux/services/userService";
import { useEffect } from "react";
import { initiateLogout } from "@/redux/services/userService";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/util/auth";
import { useDispatch } from "react-redux";

export default function Navigation() {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
    }
    dispatch(getCurrentUser());
  }, []);
  return (
    <>
      <ListGroup defaultActiveKey="#link1">
        <ListGroup.Item action href="#link1">
          Users Management
        </ListGroup.Item>
        <ListGroup.Item action href="#link2">
          Allocations Management
        </ListGroup.Item>
        <ListGroup.Item action>Goals Management</ListGroup.Item>
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
