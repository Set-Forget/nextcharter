import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Table from "../../components/Table";
import useGetData from "../../hooks/useGetData";
import { setModalState } from "../../store/modalState";
import ViewRegisters from "./modal-views/ViewRegisters";

const columns = [
    {
        name: "Student name",
        accessor: "name",
    },
    {
        name: "Student code",
        accessor: "code",
    },
    {
        name: "Student email",
        accessor: "email",
    },
    {
        name: "Registers",
        accessor: "registers",
    },
];

const TABLE_TITLE = "Registers";
const TABLE_SUBTITLE =
    "A list of all the registers in your account including the student name, student code, domain, course and competencies.";
const itemsPerPage = 10;

export default function Registers() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");

    const students = useGetData("student");

    const adaptedStudents = students.data.map((student) => ({
        ...student,
        name: `${student.name} ${student.lastname}`,
        registers: (
            <Button
                onClick={() => handleViewRegisters(student.id, `${student.name} ${student.lastname}`)}
                variant="link"
            >
                View registers
            </Button>
        ),
    }));

    const sortedData = adaptedStudents.sort((a, b) => b.code - a.code);

    const filteredData = sortedData.filter((student) =>
        student.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedData = filteredData.slice(startIndex, endIndex);

    const handleViewRegisters = (id, name) => {
        setModalState({
            open: true,
            payload: { id },
            title: "Registers",
            subtitle: "A detailed view of the student registers",
            view: <ViewRegisters studentId={id} studentName={name} />,
        });
    };

    const handleNext = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevious = () => {
        setCurrentPage(currentPage - 1);
    };

    const onSearch = (e) => {
        setSearchValue(e.target.value);
        setCurrentPage(1);
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gray-100 place-items-center pt-20 relative">
            <Table
                columns={columns}
                data={paginatedData}
                title={TABLE_TITLE}
                subtitle={TABLE_SUBTITLE}
                isLoading={students.isLoading}
                toolbar={
                    <Input
                        icon={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                        placeholder="Search by student name"
                        className="w-72"
                        value={searchValue}
                        onChange={onSearch}
                    />
                }
                footer={
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-700">
                            Showing {startIndex + 1} to{" "}
                            {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                            {filteredData.length} entries
                        </span>
                        <div className="flex gap-2">
                            <Button onClick={handlePrevious} disabled={currentPage === 1}>
                                Previous
                            </Button>
                            <Button onClick={handleNext} disabled={currentPage === totalPages}>
                                Next
                            </Button>
                        </div>
                    </div>
                }
            />
        </main>
    );
}
