import Navigation from "@/components/navigation";
import Image from "next/image";
import Head from "next/head";
export default function AdminLayout({ children }) {
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
          <p className="text-center mt-3">
            <Image src="/images/maxwealth-logo.png" width={150} height={40} />
          </p>
          <Navigation></Navigation>
        </div>
        <div className="col-lg-10 offset-lg-2 pe-5 content-area">
          {children}
        </div>
      </div>
    </>
  );
}
