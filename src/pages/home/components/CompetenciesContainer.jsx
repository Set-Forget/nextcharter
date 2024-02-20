import { useEffect } from "react";
import useGetData from "../../../hooks/useGetData";
import Chip from "../../../components/Chip";

export default function CompetenciesContainer({ selectedCourses, setValue, toolbar }) {
    const competencies = useGetData("competency");
    const competenciesByCourse = useGetData("competency_course");

    const formattedCompetenciesByCourse = competenciesByCourse.data
        .map((competencyCourse) => {
            const course = competencies.data.find(
                (competency) => competency.id === competencyCourse.competency_id
            );

            return {
                id: competencyCourse.competency_id,
                name: course?.name,
                courseId: competencyCourse.course_id,
                competency_course_id: competencyCourse.id,
                courseName: selectedCourses?.find((course) => course.id === competencyCourse.course_id)?.name,
            };
        })
        .filter(
            (competency) =>
                selectedCourses && selectedCourses.some((course) => course.id === competency.courseId)
        );

    const competenciesGroupedByCourse = Object.values(
        formattedCompetenciesByCourse.reduce((acc, competency) => {
            (acc[competency.courseId] = acc[competency.courseId] || []).push(competency);
            return acc;
        }, {})
    );

    useEffect(() => {
        if (formattedCompetenciesByCourse.length > 0) {
            setValue("competencies", formattedCompetenciesByCourse);
        }
    }, [selectedCourses]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-1 mb-1">
                <label className="text-sm font-medium leading-6 text-gray-900 flex items-center">
                    Compentencies
                </label>
                {toolbar && toolbar}
            </div>
            <div className="h-full max-h-[350px] shadow-sm ring-1 ring-inset ring-gray-300 rounded-lg overflow-y-auto py-1.5 px-3 mb-4">
                {competenciesGroupedByCourse.length > 0 ? (
                    competenciesGroupedByCourse.map((competencies, index) => (
                        <div key={index} className="flex flex-col gap-0.5">
                            <label className="text-sm text-gray-400">{competencies[0].courseName}</label>
                            <div className="mb-4">
                                {competencies.map((competency) => (
                                    <Chip key={competency.id} label={competency.name} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400">Select a course to see its competencies</p>
                )}
            </div>
        </div>
    );
}
