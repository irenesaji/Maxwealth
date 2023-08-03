import Navigation from "../components/navigation";
import Image from "next/image";
import Head from "next/head";
export default function AdminLayout({ children }) {
  return (
    <>
      <Head>
        <title>Findola Capital</title>
        <meta name="description" content="Findola Capital" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="row mx-0">
        <div className="col-lg-3 navigation">
          <p className="text-center mt-3">
            <Image src="/images/logo.png" width={250} height={80} />
          </p>
          <Navigation></Navigation>
        </div>
        <div className="col-lg-9 offset-lg-3">{children}</div>
      </div>
    </>
  );
}
