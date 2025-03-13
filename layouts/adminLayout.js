import Navigation from "@/components/navigation";
import Image from "next/image";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getSubDomain } from "@/util/common";
export default function AdminLayout({ children }) {
  const [tenant, setTenant] = useState("");

  useEffect(() => {
    setTenant(getSubDomain());

  }, [tenant]);
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
              />
              :
              <div style={{ width: '180px', height: '50px' }}>
              </div>
            }
          </div>
          <Navigation></Navigation>
        </div>
        <div className="col-lg-10 offset-lg-2 pe-5 content-area">
          {children}
        </div>
      </div>
    </>
  );
}
