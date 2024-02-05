import CompetencyCard from "./CompetencyCard";
import CourseCard from "./CourseCard";

export default function CourseContainer({ course }) {
    const leftCards = course.competencies.filter(
        (competency) => competency.status !== "transfer" && competency.status !== "competent"
    );
    const rightCards = course.competencies.filter(
        (competency) => competency.status === "transfer" || competency.status === "competent"
    );
    const maxCards = Math.max(leftCards.length, rightCards.length);
    const isCourseCompleted = rightCards.length === course.competencies.length;

    const additionalLeftCards = Array(maxCards - leftCards.length).fill({
        status: "blank",
    });
    const additionalRightCards = Array(maxCards - rightCards.length).fill({ status: "blank" });

    return (
        <div className="flex gap-4">
            <div className="flex gap-2">
                {additionalLeftCards.map((_, index) => (
                    <CompetencyCard key={index} status="blank" />
                ))}
                {leftCards.map(({ name, status }, index) => (
                    <CompetencyCard key={index} title={name} status={status} courseName={course.name} />
                ))}
            </div>
            <CourseCard title={course.name} completed={isCourseCompleted} />
            <div className="flex gap-2">
                {rightCards.map(({ name, status }, index) => (
                    <CompetencyCard key={index} title={name} status={status} courseName={course.name} />
                ))}
                {additionalRightCards.map((_, index) => (
                    <CompetencyCard key={index} status="blank" />
                ))}
            </div>
        </div>
    );
}
