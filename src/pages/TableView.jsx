import Table from "../components/Table";
import Spinner from "../components/Spinner";

import { useAxios } from "../hooks/useData";
import { useState } from "react";

export default function TableView() {
    const [{ data: students, loading: studentLoading, error: studentError }] = useAxios(
        "/exec?action=registrations"
    );
    const [criteriaV, setCriteria] = useState("");
    const [valuev, setvalue] = useState("");

    if (studentLoading) return <Spinner />;
    if (studentError) return <div>Error</div>;

    const filteredByName =
        criteriaV !== "" && valuev !== ""
            ? students.data.filter(function (student) {
                  return student[criteriaV.name]?.includes(valuev);
              })
            : students.data;

    return (
        <main className="flex-1 overflow-y-auto bg-gray-100 place-items-center pt-20 relative">
            <Table
                people={filteredByName}
                value={valuev}
                setvalue={setvalue}
                criteria={criteriaV}
                setCriteria={setCriteria}
            />
        </main>
    );
}
