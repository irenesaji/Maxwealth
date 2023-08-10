import ListGroup from "react-bootstrap/ListGroup";
import { getCurrentUser } from "@/redux/services/userService";
import { useEffect } from "react";
import { initiateLogout } from "@/redux/services/userService";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/util/auth";
import { useDispatch } from "react-redux";
import {
  ADMIN_RISK_PROFILES_ANSWER_WEIGHTAGE,
  ADMIN_RISK_PROFILES_ANSWERS,
  ADMIN_RISK_PROFILES,
  ADMIN_RISK_PROFILES_QUESTIONS,
} from "@/util/urls";

export default function Navigation() {
  const router = useRouter();

  return (
    <>
      <ListGroup defaultActiveKey="#" horizontal className="mb-5 mt-5">
        <ListGroup.Item
          action
          href={ADMIN_RISK_PROFILES}
          active={router.pathname === ADMIN_RISK_PROFILES}
        >
          Risk Profiles
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_RISK_PROFILES_QUESTIONS}
          active={router.pathname === ADMIN_RISK_PROFILES_QUESTIONS}
        >
          Risk Profile Questions
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_RISK_PROFILES_ANSWER_WEIGHTAGE}
          active={router.pathname === ADMIN_RISK_PROFILES_ANSWER_WEIGHTAGE}
        >
          Risk Profile Answer Weightage
        </ListGroup.Item>
        <ListGroup.Item
          action
          href={ADMIN_RISK_PROFILES_ANSWERS}
          active={router.pathname === ADMIN_RISK_PROFILES_ANSWERS}
        >
          Risk Profile Answers
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}
