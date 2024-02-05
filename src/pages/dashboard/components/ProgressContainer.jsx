import ProgressBar from "../../../components/ProgressBar";
import VariableProgressBar from "./VariableProgressBar";

export default function ProgressContainer({ selectedStudent, studentRegisters, isLoading }) {
    const getOverallProgress = () => {
        let totalCompetencies = 0;
        let totalCompetent = 0;

        studentRegisters &&
            studentRegisters.domains.forEach((domain) => {
                domain.courses.forEach((course) => {
                    totalCompetencies += course.competencies.length;
                    totalCompetent += course.competencies.filter(
                        (competency) => competency.status === "competent" || competency.status === "transfer"
                    ).length;
                });
            });

        return ((totalCompetent / totalCompetencies) * 100).toFixed();
    };

    const overallProgress = isNaN(getOverallProgress()) ? 0 : getOverallProgress();

    return (
        <div className="ml-auto">
            <ProgressBar isLoading={isLoading} label="Percentage of progress" progress={overallProgress} />
            <VariableProgressBar
                label="Progress based on selected year"
                studentRegisters={studentRegisters}
                selectedStudent={selectedStudent}
                isLoading={isLoading}
            />
        </div>
    );
}
