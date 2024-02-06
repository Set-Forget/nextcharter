import { useState } from "react";
import CourseFormContainer from "./components/CourseFormContainer";
import RegistersDisplayContainer from "./components/RegistersDisplayContainer";

export default function Home() {
    const [currentRegisters, setCurrentRegisters] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    return (
        <main className="flex-1 bg-white place-items-center p-4 relative container mx-auto">
            <div className="h-[calc(100vh-115px)] mt-20 rounded-lg flex">
                <CourseFormContainer
                    setSelectedStudent={setSelectedStudent}
                    setCurrentRegisters={setCurrentRegisters}
                />
                <RegistersDisplayContainer
                    selectedStudent={selectedStudent}
                    setCurrentRegisters={setCurrentRegisters}
                    currentRegisters={currentRegisters}
                />
            </div>
        </main>
    );
}
