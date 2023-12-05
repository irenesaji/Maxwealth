import Navigation from "@/components/navigation";
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
        <div className="col-lg-2 navigation">
          <p className="text-center mt-3">
            <Image src="/images/logo.png" width={230} height={60} />
          </p>
          <Navigation></Navigation>
        </div>
        <div className="col-lg-9 offset-lg-3 pe-5 content-area">{children}</div>
      </div>
    </>
  );
}
