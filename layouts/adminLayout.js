import Navigation from "@/components/navigation";
import Image from "next/image";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getSubDomain } from "@/util/common";
import Dropdown from "react-bootstrap/Dropdown";
import { useRouter } from "next/router";
import { initiateLogout } from "@/redux/services/userService";

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export default function AdminLayout({ children }) {
  const [tenant, setTenant] = useState("");
  const [lastLogin, setLastLogin] = useState("");
  const [failedLogin, setFailedLogin] = useState("");
  const router = useRouter();

  useEffect(() => {
    setTenant(getSubDomain());

    const nowIso = new Date().toISOString();
    const savedLastLogin = localStorage.getItem("last_login_at") || nowIso;
    const savedFailedLogin = localStorage.getItem("failed_login_at") || nowIso;
    setLastLogin(savedLastLogin);
    setFailedLogin(savedFailedLogin);

    localStorage.setItem("last_login_at", savedLastLogin);
    localStorage.setItem("failed_login_at", savedFailedLogin);
  }, []);

  return (
    <>
      <Head>
        <title>Max Wealth</title>
        <meta name="description" content="Max Wealth" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="row mx-0">
        <div className="col-lg-2 navigation">
          <div className=" d-flex justify-content-center text-center mt-3">
            {tenant ?
              <Image
                src={tenant === 'elixir' ? '/images/Paisa_Smart_white.svg' : '/images/maxwealth-logo.png'}
                width={tenant === 'elixir' ? 200 : 150} height={tenant === 'elixir' ? 60 : 40}
                alt="Tenant logo"
              />
              :
              <div style={{ width: '180px', height: '50px' }}>
              </div>
            }
          </div>
          <Navigation></Navigation>
        </div>
        <div className="col-lg-10 offset-lg-2 pe-5 content-area">
          <div className="admin-top-meta d-flex justify-content-end align-items-start mt-3 mb-2">
            <div className="admin-login-meta text-end me-3">
              <div>
                <strong>Last login:</strong> {formatDateTime(lastLogin)}
              </div>
              <div>
                <strong>Failed login:</strong> {formatDateTime(failedLogin)}
              </div>
            </div>
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" className="admin-user-toggle">
                ADMIN 7306100556
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    initiateLogout(router);
                  }}
                >
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
