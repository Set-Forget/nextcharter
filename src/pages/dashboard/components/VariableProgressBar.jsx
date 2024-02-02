import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Button from "../../../components/Button";
import { useState } from "react";
import { useEffect } from "react";

export default function VariableProgressBar({ label, studentRegisters, selectedStudent, isLoading }) {
    const currentDate = selectedStudent && new Date(selectedStudent.created_at);
    const defaultTargetYear = currentDate && currentDate.getFullYear() + 4;

    const [selectedYear, setSelectedYear] = useState(defaultTargetYear);
    const [progress, setProgress] = useState(0);

    const transformDataAndGetCredits = () => {
        let totalCompetentCredits = 0;
        let totalCredits = 0;

        if (studentRegisters.length === 0) return setProgress(0);

        studentRegisters.domains.forEach((domain) => {
            domain.courses.forEach((course) => {
                const competencyCreditValue = course.credit_value / course.competencies.length;
                course.competencies.forEach((competency) => {
                    totalCredits += competencyCreditValue;
                    if (competency.status === "competent") {
                        totalCompetentCredits += competencyCreditValue;
                    }
                });
            });
        });

        const currentYear = new Date().getFullYear();
        const yearsUntilTarget = Math.max(selectedYear - currentYear, 0);

        const percentage =
            yearsUntilTarget === 0
                ? (totalCompetentCredits / totalCredits) * 100
                : (totalCompetentCredits / (totalCredits / (yearsUntilTarget + 1))) * 100;

        setProgress(Math.min(percentage, 100).toFixed(2));
    };

    const handleSumYear = () => {
        setSelectedYear(selectedYear + 1);
    };

    const handleRestYear = () => {
        if (selectedYear <= new Date().getFullYear()) return;
        setSelectedYear(selectedYear - 1);
    };

    useEffect(() => {
        if (!selectedYear || !studentRegisters) return;
        transformDataAndGetCredits();
    }, [selectedYear, studentRegisters]);

    useEffect(() => {
        if (!studentRegisters) return;
        setSelectedYear(defaultTargetYear);
    }, [studentRegisters]);

    return (
        <div className="ml-auto mt-6 w-96 flex flex-col items-center gap-4">
            <div className="flex w-full justify-between -mb-3">
                <p className="text-sm font-medium leading-6 mb-1 text-gray-900">{label}</p>
                <div className="flex flex-row items-center gap-2">
                    <Button
                        disabled={selectedYear <= new Date().getFullYear()}
                        onClick={handleRestYear}
                        className="!p-1.5 !rounded-full"
                        variant="ghost"
                    >
                        <ChevronLeftIcon className="w-4 h-4 text-nextcolor" />
                    </Button>
                    <p className="text-sm leading-6 text-gray-900">{selectedYear}</p>
                    <Button onClick={handleSumYear} className="!p-1.5 !rounded-full" variant="ghost">
                        <ChevronRightIcon className="w-4 h-4 text-nextcolor" />
                    </Button>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full">
                {isLoading ? (
                    <div role="status" className="max-w-sm animate-pulse">
                        <div className="h-4 w-96 bg-gray-200 rounded-full"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : (
                    <div className="w-full bg-gray-200 rounded-full">
                        <div
                            className="bg-nextcolor text-xs transition-all duration-300 ease-in-out font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                            style={{ width: `${progress}%` }}
                        >
                            {progress}%
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
