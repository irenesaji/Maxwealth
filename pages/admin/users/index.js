import AdminLayout from "@/pages/layouts/adminLayout";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
const columns = [
  {
    name: "Title",
    selector: (row) => row.title,
    sortable: true,
  },
  {
    name: "Year",
    selector: (row) => row.year,
    sortable: true,
  },
];

const data = [
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
];

export default function index() {
  const [domloaded, setDomLoaded] = useState(false);
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  return (
    <>
      <AdminLayout>
        <h2 className="mt-5 mb-5">
          <strong>Users</strong>
        </h2>
        {domloaded && (
          <DataTable
            columns={columns}
            data={data}
            pagination
            theme="solarized"
          />
        )}
      </AdminLayout>
    </>
  );
}
