import { useEffect, useState } from "react";
import useInfo from "../../../hooks/useInfo";
import StudentRegisterCard from "./StudentRegisterCard";
import { setDialogState } from "../../../store/dialogState";
import { supabase } from "../../../lib/api";
import useGetData from "../../../hooks/useGetData";
import TotalCreditCounter from "./TotalCreditCounter";
import Button from "../../../components/Button";

export default function RegistersDisplayContainer({
    selectedStudent,
    setCurrentRegisters,
    currentRegisters,
}) {
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const competencyCourses = useGetData("competency_course");

    const { getFromDatabase, insertToDatabase } = useInfo();

    const registersAdapter = (registers) => {
        const result = {};

        registers.forEach((item) => {
            const { domain_name, course_name, competency_id, competency_course_id } = item;

            if (!result[domain_name]) {
                result[domain_name] = {
                    name: domain_name,
                    courses: {},
                    exist: true,
                    id: competency_course_id,
                };
            }

            if (!result[domain_name].courses[course_name]) {
                result[domain_name].courses[course_name] = {
                    name: course_name,
                    competencies: [],
                    credits: competencyCourses.data.find((item) => item.id === competency_course_id)
                        .credit_value,
                };
            }

            result[domain_name].courses[course_name].competencies.push(competency_id);
        });

        Object.keys(result).forEach((domain) => {
            const courses = result[domain].courses;
            result[domain].courses = Object.keys(courses).map((courseName) => courses[courseName]);
        });

        return Object.values(result);
    };

    const handleDelete = (studentCode, register) => {
        const totalCompetencies = register.courses.reduce((acc, cv) => acc + cv.competencies.length, 0);
        const competencyIds = register.courses
            .map((item) => item.competencies)
            .reduce((acc, cv) => acc.concat(cv), []);

        if (!register.exist) {
            return setCurrentRegisters((prev) =>
                prev.filter((item) => item.exist || item.name !== register.name)
            );
        }

        setDialogState({
            open: true,
            title: "Unsubscribe competencies",
            description: `Are you sure you want to unsuscribe from ${totalCompetencies} competencies?`,
            onConfirm: async () => {
                setLoading(true);
                try {
                    await supabase
                        .from("registers")
                        .update({ is_deleted: true })
                        .eq("student_code", studentCode)
                        .in("competency_id", competencyIds);
                    getStudentRegisters();
                } catch (error) {
                    throw new Error(error);
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const getStudentRegisters = async () => {
        setLoading(true);
        try {
            const studentRegisters = await getFromDatabase(
                "student_code",
                selectedStudent.student_code,
                "registers"
            );

            const adaptedRegisters = registersAdapter(studentRegisters);
            setCurrentRegisters(adaptedRegisters);
        } catch (error) {
            throw new Error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        const nonExistingRegisters = currentRegisters.filter((item) => !item.exist);
        const adaptedRegisters = nonExistingRegisters.flatMap((dataItem) =>
            dataItem.courses.flatMap((course) =>
                course.competencies.map((competency) => ({
                    student_id: selectedStudent.id,
                    student_code: selectedStudent.student_code,
                    domain_name: dataItem.name,
                    course_name: course.name,
                    competency_name: competency.name,
                    competency_id: competency.id,
                    competency_course_id: competency.competencyCourseId,
                    status: dataItem.institution === "Other" ? "transfer" : "plan to meet",
                }))
            )
        );

        setSubmitLoading(true);
        try {
            await insertToDatabase(adaptedRegisters, "registers");
            getStudentRegisters();
        } catch (error) {
            throw new Error(error);
        } finally {
            setSubmitLoading(false);
        }
    };

    const existingCredits = currentRegisters
        .filter((item) => item.exist)
        .reduce((acc, cv) => acc + cv.courses.reduce((acc, cv) => acc + cv.credits, 0), 0);

    const nonExistingCredits = currentRegisters
        .filter((item) => !item.exist)
        .reduce((acc, cv) => acc + cv.courses.reduce((acc, cv) => acc + cv.credits, 0), 0);

    const totalCredits = existingCredits + nonExistingCredits;

    useEffect(() => {
        if (selectedStudent) getStudentRegisters();
    }, [selectedStudent]);

    return (
        <div className="flex flex-col flex-1 p-6 bg-gray-100 h-full rounded-lg rounded-tl-none rounded-bl-none border border-l-0 border-gray-100">
            <div className="flex-1 no-scrollbar overflow-y-auto pb-4">
                <ul role="list" className="grid grid-cols-1 gap-3">
                    {!loading &&
                        currentRegisters.map((register) => (
                            <StudentRegisterCard
                                key={register.name}
                                studentName={selectedStudent.name}
                                domainName={register.name}
                                courses={register.courses}
                                onDelete={() => handleDelete(selectedStudent.student_code, register)}
                                exist={register.exist}
                            />
                        ))}
                    {loading && (
                        <div className="h-1 w-full overflow-hidden">
                            <div className="animate-progress w-full h-full bg-nextcolor origin-left-right"></div>
                        </div>
                    )}
                    {selectedStudent && currentRegisters.length === 0 && !loading && (
                        <div className="px-4 py-3 text-center text-lg text-gray-900">
                            There is no register for this student
                        </div>
                    )}
                </ul>
            </div>
            <div className="flex">
                <TotalCreditCounter totalCredits={totalCredits} nonExistingCredits={nonExistingCredits} />
            </div>
            <Button
                isLoading={submitLoading}
                size="lg"
                type="button"
                onClick={handleSubmit}
                disabled={!selectedStudent || nonExistingCredits === 0}
            >
                Submit
            </Button>
        </div>
    );
}
