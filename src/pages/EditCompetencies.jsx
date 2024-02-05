import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import MultiSelect from "../components/MultiSelectV2";
import SearchSelect from "../components/SearchSelect";
import Select from "../components/Select";
import useGetData from "../hooks/useGetData";
import { supabase } from "../lib/api";

export default function EditCompetencies() {
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [resetQuery, setResetQuery] = useState(false);

    const students = useGetData("student");
    const domains = useGetData("domain");
    const courses = useGetData("course");
    const competencies = useGetData("competency");
    const competenciesByCourse = useGetData("competency_course");
    const institution_domain = useGetData("institution_domain");

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoadingSubmit(true);
        setResetQuery(true);
        const competencies_id = data.competencies.map((competency) => competency.id);

        try {
            await supabase
                .from("registers")
                .update({ status: data.status.value })
                .eq("student_id", data.student.id)
                .in("competency_id", competencies_id);
        } catch (error) {
            throw new Error(error.message);
        } finally {
            setIsLoadingSubmit(false);
            setResetQuery(false);
            reset();
        }
    };
    const selectedDomain = watch("domains");
    const selectedCourse = watch("courses");

    const institutionIdToFilter = "d00697b7-20ab-4cb4-a4bf-a1da9fe179bf";

    const filteredDomainIds = institution_domain.data
        .filter((item) => item.institution_id === institutionIdToFilter)
        .map((item) => item.domain_id);

    const filteredDomains = domains.data.filter(
        (domain) => filteredDomainIds.includes(domain.id) && domain.name
    );

    const formattedDomains = filteredDomains.map((domain) => ({
        id: domain.id,
        name: domain.name,
    }));

    const formattedCourses = courses.data
        .map((course) => ({
            id: course.id,
            name: course.name,
            domainId: course.inst_domain_id,
        }))
        .filter((course) => course.domainId === selectedDomain?.id);

    const formattedStudents = students.data.map((student) => ({
        id: student.id,
        name: student.name + " " + student.lastname,
    }));

    const formattedCompetenciesByCourse = competenciesByCourse.data
    .map((competencyCourse) => {
        const course = competencies.data.find(
            (competency) => competency.id === competencyCourse.competency_id
        );

        return {
            id: competencyCourse.competency_id,
            name: course?.name,
            courseId: competencyCourse.course_id,
        };
    })
    .filter((competency) => competency.courseId === selectedCourse?.id)
    .filter((function() {
        const seenIds = new Set();
        return function(competency) {
            if (!seenIds.has(competency.id)) {
                seenIds.add(competency.id);
                return true;
            }
            return false;
        };
    })());

    return (
        <main className="flex-1 bg-gray-100 place-items-center relative pb-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mx-auto gap-4 flex flex-col items-center max-w-3xl h-[calc(100vh-100px)] mt-20"
            >
                <SearchSelect
                    name="student"
                    control={control}
                    label="Student"
                    register={register("student", { required: true })}
                    placeholder="Select a student"
                    data={students.isLoading ? [] : formattedStudents}
                    errors={errors.student && "Student is required"}
                    resetQuery={resetQuery}
                />
                <SearchSelect
                    name="domains"
                    label="Domains"
                    placeholder="Select the project domains"
                    data={domains.isLoading ? [] : formattedDomains}
                    register={register("domains", { required: true })}
                    control={control}
                    errors={errors.domains && "Project domains are required"}
                />
                <SearchSelect
                    name="courses"
                    label="Courses"
                    placeholder="Select the project courses"
                    data={courses.isLoading ? [] : formattedCourses}
                    register={register("courses", { required: true })}
                    control={control}
                    errors={errors.courses && "Project courses are required"}
                />
                <MultiSelect
                    name="competencies"
                    label="Competencies"
                    placeholder="Select the project competencies"
                    data={competencies.isLoading ? [] : formattedCompetenciesByCourse}
                    register={register("competencies", { required: true })}
                    control={control}
                    errors={errors.competencies && "Project competencies are required"}
                />
                <Select
                    name="status"
                    label="Status"
                    placeholder="Select the project status"
                    data={[
                        { id: 1, name: "Plan to meet", value: "plan to meet" },
                        { id: 2, name: "Not met", value: "not met" },
                        { id: 3, name: "Attempting to meet", value: "attempting to meet" },
                        { id: 4, name: "Competent", value: "competent" },
                        { id: 5, name: "Transfer", value: "transfer" },
                    ]}
                    register={register("status", { required: true })}
                    control={control}
                    errors={errors.status && "Project status is required"}
                />
                <Button isLoading={isLoadingSubmit} className="mt-4" type="submit">
                    Submit
                </Button>
            </form>
        </main>
    );
}
