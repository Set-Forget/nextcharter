import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useInfo from "../../hooks/useInfo";
import getStudentProgressPDF from "./utils/getStudentProgressPDF";
import useGetData from "../../hooks/useGetData";
import Select from "../../components/Select";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import DomainContainer from "./components/DomainContainer";
import CourseContainer from "./components/CourseContainer";
import ProgressContainer from "./components/ProgressContainer";

export default function StudentProgress() {
    const studentId = useParams().id;
    const students = useGetData("student");
    const competencyCourseData = useGetData("competency_course");

    const formattedStudents = students.data?.map((student) => ({
        ...student,
        name: `${student.name} ${student.lastname}`,
    }));

    const { getFromDatabase } = useInfo();
    const { handleSubmit, control, setValue, watch } = useForm();

    const [studentRegisters, setStudentRegisters] = useState(null);
    const [loading, setLoading] = useState(false);

    const selectedStudent = watch("student");

    const getRegistersByStudent = async (studentId) => {
        const registers = await getFromDatabase("student_code", studentId, "registers");

        if (registers.length === 0) return null;

        const formattedRegisters = registers.filter((register) => register.is_deleted === false);
        const student = students.data.find((student) => student.code === studentId);

        const domainMap = new Map();

        const groupedData = {
            id: formattedRegisters[0].id,
            student_code: formattedRegisters[0].student_code,
            studentName: `${student.name} ${student.lastname}`,
            date: new Date().toLocaleDateString(),
            domains: [],
        };

        formattedRegisters.forEach((item) => {
            if (!domainMap.has(item.domain_name)) {
                const newDomain = { name: item.domain_name, courses: new Map(), progress: 0 };
                domainMap.set(item.domain_name, newDomain);
                groupedData.domains.push(newDomain);
            }

            const domain = domainMap.get(item.domain_name);
            if (!domain.courses.has(item.course_name)) {
                domain.courses.set(item.course_name, {
                    name: item.course_name,
                    id: competencyCourseData.data.find((course) => course.id === item.competency_course_id)
                        .course_id,
                    credit_value: competencyCourseData.data.find(
                        (course) => course.id === item.competency_course_id
                    ).credit_value,
                    competencies: [],
                });
            }

            const course = domain.courses.get(item.course_name);
            course.competencies.push({ name: item.competency_name, status: item.status });
        });

        groupedData.domains.forEach((domain) => {
            const coursesArray = Array.from(domain.courses.values());
            const totalCompetencies = coursesArray.reduce(
                (total, course) => total + course.competencies.length,
                0
            );
            const completedCompetencies = coursesArray.reduce((completed, course) => {
                return (
                    completed +
                    course.competencies.filter(
                        (comp) => comp.status === "competent" || comp.status === "transfer"
                    ).length
                );
            }, 0);

            domain.progress = Math.round((completedCompetencies / totalCompetencies) * 100);
            domain.courses = coursesArray;
        });

        let totalCompetenciesCompleted = 0;
        let totalCompetencies = 0;

        groupedData.domains.forEach((domain) => {
            domain.courses.forEach((course) => {
                totalCompetencies += course.competencies.length;
                course.competencies.forEach((comp) => {
                    if (comp.status === "competent" || comp.status === "transfer") {
                        totalCompetenciesCompleted++;
                    }
                });
            });
        });

        const totalPercentageApproved = Math.round((totalCompetenciesCompleted / totalCompetencies) * 100);
        groupedData.percentageCompleted = totalPercentageApproved;

        return groupedData;
    };

    const onSearch = async (data) => {
        setLoading(true);
        try {
            const registersByStudent = await getRegistersByStudent(data.student.code);
            setStudentRegisters(registersByStudent);
        } catch (error) {
            throw new Error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (students.isLoading || competencyCourseData.isLoading) return;

        const defaultStudent = studentId && formattedStudents.find((student) => student.code == studentId);
        setValue("student", defaultStudent);
        onSearch({ student: defaultStudent });
    }, [students.isLoading, competencyCourseData.isLoading]);

    return (
        <main className="flex-1 overflow-y-auto bg-slate-50 place-items-center pr-4 pl-4 pt-20">
            <div className="mb-8 mt-8 flex items-end gap-2">
                <Select
                    label="Select Student"
                    name="student"
                    control={control}
                    data={formattedStudents}
                    placeholder="Select Student"
                    className="w-60"
                />
                <Button
                    isLoading={loading}
                    type="button"
                    size="md"
                    disabled={!selectedStudent}
                    onClick={handleSubmit(onSearch)}
                >
                    Search
                </Button>
                <Button
                    type="button"
                    disabled={!studentId || !studentRegisters}
                    onClick={() => getStudentProgressPDF(studentRegisters)}
                >
                    Download PDF
                </Button>
                <ProgressContainer
                    selectedStudent={selectedStudent}
                    studentRegisters={studentRegisters}
                    isLoading={students.isLoading || competencyCourseData.isLoading || loading}
                />
            </div>
            {!students.isLoading && !competencyCourseData.isLoading && !loading ? (
                <div className="flex flex-col gap-8">
                    {studentRegisters ? (
                        <div className="flex flex-col gap-8">
                            {studentRegisters.domains.map(({ name, courses }) => (
                                <DomainContainer key={name} title={name}>
                                    {courses.map((course) => (
                                        <CourseContainer key={course.name} course={course} />
                                    ))}
                                </DomainContainer>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center">
                            <h1 className="text-2xl text-gray-600">
                                There is no data for this student. Please select another student.
                            </h1>
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-1 w-full overflow-hidden">
                    <div className="animate-progress w-full h-full bg-nextcolor origin-left-right"></div>
                </div>
            )}
        </main>
    );
}
