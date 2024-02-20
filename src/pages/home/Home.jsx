import { useState } from "react";
import CourseFormContainer from "./components/CourseFormContainer";
import RegistersDisplayContainer from "./components/RegistersDisplayContainer";
import useInfo from "../../hooks/useInfo";
import useGetData from "../../hooks/useGetData";

export default function Home() {
    const [currentRegisters, setCurrentRegisters] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(false);

    const competencyCourses = useGetData("competency_course");

    const { getFromDatabase } = useInfo();

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

    const getStudentRegisters = async (studentCode) => {
        setLoading(true);
        try {
            const studentRegisters = await getFromDatabase("student_code", studentCode, "registers");
            const adaptedRegisters = registersAdapter(studentRegisters);
            setCurrentRegisters(adaptedRegisters);
        } catch (error) {
            throw new Error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 bg-white place-items-center p-4 relative container mx-auto">
            <div className="h-[calc(100vh-115px)] mt-20 rounded-lg flex">
                <CourseFormContainer
                    loading={loading || competencyCourses.isLoading}
                    setSelectedStudent={setSelectedStudent}
                    setCurrentRegisters={setCurrentRegisters}
                    getStudentRegisters={getStudentRegisters}
                    currentRegisters={currentRegisters}
                />
                <RegistersDisplayContainer
                    loading={loading}
                    selectedStudent={selectedStudent}
                    setCurrentRegisters={setCurrentRegisters}
                    currentRegisters={currentRegisters}
                    getStudentRegisters={getStudentRegisters}
                />
            </div>
        </main>
    );
}
