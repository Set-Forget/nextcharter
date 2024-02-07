import { useState } from "react";
import Button from "../../../components/Button";
import useInfo from "../../../hooks/useInfo";
import { supabase } from "../../../lib/api";
import { setDialogState } from "../../../store/dialogState";
import StudentRegisterCard from "./StudentRegisterCard";
import TotalCreditCounter from "./TotalCreditCounter";

export default function RegistersDisplayContainer({
    selectedStudent,
    setCurrentRegisters,
    currentRegisters,
    loading,
    getStudentRegisters,
}) {
    const [submitLoading, setSubmitLoading] = useState(false);

    const { insertToDatabase } = useInfo();

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
                try {
                    await supabase
                        .from("registers")
                        .update({ is_deleted: true })
                        .eq("student_code", studentCode)
                        .in("competency_id", competencyIds);
                    getStudentRegisters(studentCode);
                } catch (error) {
                    throw new Error(error);
                } finally {
                }
            },
        });
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
            getStudentRegisters(selectedStudent.student_code);
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
