import { useState } from "react";
import useGetFilterData from "../../../hooks/useGetFilterData";
import Table from "../../../components/Table";
import Chip from "../../../components/Chip";
import { colorPallete } from "../../dashboard/components/CompetencyCard";
import Input from "../../../components/Input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const columns = [
    {
        name: "Domain",
        accessor: "domain_name",
    },
    {
        name: "Course",
        accessor: "course_name",
    },
    {
        name: "Competencies",
        accessor: "competencies",
    },
];

export default function ViewRegisters({ studentId, studentName }) {
    const studentRegisters = useGetFilterData("registers", "student_id", studentId);
    const [searchValue, setSearchValue] = useState("");

    const getAdaptedRegisters = (data) => {
        const result = [];

        data.forEach((item) => {
            const competency = {
                competency_name: item.competency_name,
                status: item.status,
            };

            let domainEntry = result.find(
                (entry) =>
                    entry.student_id === item.student_id &&
                    entry.domain_name === item.domain_name &&
                    entry.course_name === item.course_name
            );

            if (!domainEntry) {
                domainEntry = {
                    student_name: studentName,
                    student_id: item.student_id,
                    student_code: item.student_code,
                    domain_name: item.domain_name,
                    course_name: item.course_name,
                    competencies: [],
                };
                result.push(domainEntry);
            }

            const competencyExists = domainEntry.competencies.some(
                (c) => c.competency_name === competency.competency_name
            );

            if (!competencyExists) {
                domainEntry.competencies.push(competency);
            }
        });

        return result;
    };

    const adaptedRegisters = getAdaptedRegisters(studentRegisters.data).filter((item) =>
        item.domain_name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const data = adaptedRegisters
        .map((item) => ({
            domain_name: item.domain_name,
            course_name: item.course_name,
            competencies: item.competencies.map((competency) => {
                return (
                    <Chip
                        key={competency.competency_name}
                        label={competency.competency_name}
                        color={colorPallete[competency.status].bg}
                    />
                );
            }),
        }))
        .sort((a, b) => a.domain_name.localeCompare(b.domain_name));

    const onSearch = (e) => {
        setSearchValue(e.target.value);
    };

    return (
        <div className="min-w-[985px]">
            <Table
                title={`Registers for ${studentName}`}
                toolbar={
                    <Input
                        icon={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                        placeholder="Search by domain"
                        className="w-72"
                        value={searchValue}
                        onChange={onSearch}
                    />
                }
                columns={columns}
                data={data}
                isLoading={studentRegisters.isLoading}
            />
        </div>
    );
}
