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
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 5;

    if (studentLoading) return <Spinner />;
    if (studentError) return <div>Error</div>;

    // const filteredByName =
    //   criteriaV !== "" && valuev !== ""
    //     ? students.data.filter(function (student) {
    //         return student[criteriaV.name]?.includes(valuev);
    //       })
    //     : students.data;

    const filteredByName = students.data.filter((student) => {
        const matchesCriteria =
            criteriaV !== "" && valuev !== "" ? student[criteriaV.name]?.includes(valuev) : students.data;

        const matchesSearchQuery = searchQuery
            ? Object.values(student).some(
                  (value) =>
                      typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : students.data;

        return matchesCriteria && matchesSearchQuery;
    });

    const totalPages = Math.ceil(filteredByName.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredByName.slice(startIndex, endIndex);
    const startPage = Math.max(currentPage - 2, 1);
    const endPage = Math.min(startPage + 4, totalPages);
    console.log({ currentPage, totalPages, startIndex, endIndex, currentDataLength: currentData.length });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredByName.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    // function filterStudents(criteria, value) {
    //   return students.filter(function(student) {
    //       return student[criteria].toLowerCase() === value.toLowerCase();
    //   });
    // }

    return (
        <main className="flex-1 overflow-y-auto bg-gray-100 place-items-center pt-20 relative">
            <Table
                people={currentData}
                value={valuev}
                setvalue={setvalue}
                criteria={criteriaV}
                setCriteria={setCriteria}
                setSearchQuery={setSearchQuery}
            />
            <div className="justify-center items-center w-[1550px] ml-14">
                <nav className="flex items-center justify-between border-t border-gray-200 mt-4 px-4 sm:px-0">
                    <div className="-mt-px flex w-0 flex-1">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(1); // Go to the first page
                            }}
                            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        >
                            First
                        </a>
                    </div>

                    <div className="hidden md:-mt-px md:flex">
                        {Array.from({ length: endPage - startPage + 1 }).map((_, idx) => {
                            const pageNumber = startPage + idx;
                            return (
                                <a
                                    key={pageNumber}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage(pageNumber);
                                    }}
                                    className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                                        pageNumber === currentPage
                                            ? "border-blue-950 text-blue-950"
                                            : "border-transparent text-gray-500 hover:text-blue-900 hover:border-gray-300"
                                    }`}
                                >
                                    {pageNumber}
                                </a>
                            );
                        })}
                    </div>
                    <div className="-mt-px flex w-0 flex-1 justify-end">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(totalPages); // Go to the last page
                            }}
                            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        >
                            Last
                        </a>
                    </div>
                </nav>
            </div>
        </main>
    );
}
