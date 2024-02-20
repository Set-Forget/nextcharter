import { PlusIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";
import MultiSelect from "../../../components/MultiSelect";
import SearchSelect from "../../../components/SearchSelect";
import useGetData from "../../../hooks/useGetData";
import { setModalState } from "../../../store/modalState";
import NewCompetency from "../modal-views/NewCompetency";
import NewCourse from "../modal-views/NewCourse";
import NewDomain from "../modal-views/NewDomain";
import CompetenciesContainer from "./CompetenciesContainer";
import CreditCounter from "./CreditCounter";

export default function CourseFormContainer({
    setSelectedStudent,
    setCurrentRegisters,
    getStudentRegisters,
    currentRegisters,
    loading,
}) {
    const students = useGetData("student");
    const domains = useGetData("domain");
    const courses = useGetData("course");
    const competencyCourses = useGetData("competency_course");
    const institutions = useGetData("institution");
    const institution_domain = useGetData("institution_domain");

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const registerAdapter = () => {
            const result = {
                name: data.domains.name,
                exist: false,
                institution: data.institution.name,
                courses: [],
            };

            data.courses.forEach((course) => {
                const courseCompetencies = data.competencies
                    .filter((competency) => competency.courseId === course.id)
                    .map((competency) => ({
                        id: competency.id,
                        name: competency.name,
                        competencyCourseId: competencyCourses.data.find(
                            (item) => item.competency_id === competency.id && item.course_id === course.id
                        ).id,
                    }));

                result.courses.push({
                    id: course.id,
                    name: course.name,
                    credits: course.credits,
                    competencies: courseCompetencies,
                });
            });

            return result;
        };

        const adaptedRegister = registerAdapter();
        setCurrentRegisters((prev) => [...prev, adaptedRegister]);
        reset({ student: data.student });
    };

    const selectedInstitution = watch("institution");
    const selectedDomain = watch("domains");
    const selectedCourses = watch("courses");

    const filteredDomainIds = institution_domain?.data
        ?.filter((item) => item.institution_id === selectedInstitution?.id)
        .map((item) => item.domain_id);

    const filteredDomains = domains?.data?.filter(
        (domain) => filteredDomainIds.includes(domain.id) && domain.name
    );

    const formattedDomains = filteredDomains?.map((domain) => ({
        id: domain.id,
        name: domain.name,
        credits: domain.credits_required,
    }));

    const registeredCourseNames = new Set();
    currentRegisters.forEach((register) =>
        register.courses.forEach((course) => registeredCourseNames.add(course.name))
    );

    const formattedCourses = courses?.data
        ?.filter((course) => course.inst_domain_id === selectedDomain?.id)
        .map((course) => ({
            id: course.id,
            name: course.name,
            domainId: course.inst_domain_id,
            credits: course.credits,
        }))
        .filter((course) => !registeredCourseNames.has(course.name));

    const formattedStudents = students?.data?.map((student) => ({
        id: student.id,
        name: student.name + " " + student.lastname,
        student_code: student.code,
    }));

    const selectedCoursesCredits =
        selectedCourses && selectedCourses.reduce((acc, cv) => acc + cv.credits, 0);

    const handleViewNewDomain = () => {
        setModalState({
            open: true,
            payload: null,
            view: <NewDomain institutions={institutions} />,
            title: "New domain",
            subtitle: "Create a new domain",
            previous: null,
        });
    };

    const handleViewNewCourse = () => {
        setModalState({
            open: true,
            payload: null,
            view: (
                <NewCourse
                    institutions={institutions}
                    domains={domains}
                    institutionDomains={institution_domain}
                />
            ),
            title: "New course",
            subtitle: "Create a new course",
            previous: null,
        });
    };

    const handleViewNewCompetency = () => {
        setModalState({
            open: true,
            payload: null,
            view: (
                <NewCompetency
                    institutions={institutions}
                    domains={domains}
                    institutionDomains={institution_domain}
                    courses={courses}
                />
            ),
            title: "New competency",
            subtitle: "Create a new competency",
            previous: null,
        });
    };

    return (
        <div className="flex flex-col flex-1 p-6 rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)} className="gap-4 h-full flex flex-col">
                <SearchSelect
                    name="student"
                    control={control}
                    label="Student"
                    register={register("student", { required: true })}
                    placeholder="Select a student"
                    data={students.isLoading ? [] : formattedStudents}
                    errors={errors.student && "Student is required"}
                    loading={loading}
                    onChange={(e) => {
                        setValue("student", e);
                        setSelectedStudent(e);
                        getStudentRegisters(e.student_code);
                    }}
                />
                <SearchSelect
                    name="institution"
                    label="Institution"
                    placeholder="Select the project institution"
                    data={institutions.isLoading ? [] : institutions.data}
                    register={register("institution", { required: true })}
                    control={control}
                    errors={errors.institution && "Project institution is required"}
                />
                <SearchSelect
                    name="domains"
                    label="Domains"
                    placeholder="Select the project domains"
                    data={domains.isLoading ? [] : formattedDomains}
                    register={register("domains", { required: true })}
                    control={control}
                    errors={errors.domains && "Project domains are required"}
                    optionSubtext={{ label: "Credits required", item: "credits" }}
                    onChange={(e) => {
                        setValue("domains", e);
                        setValue("courses", []);
                    }}
                    toolbar={
                        <Button
                            type="button"
                            className="!p-1 !rounded-full"
                            variant="ghost"
                            onClick={handleViewNewDomain}
                        >
                            <PlusIcon className="h-4 w-4 text-nextcolor" aria-hidden="true" />
                        </Button>
                    }
                />
                <MultiSelect
                    name="courses"
                    label="Courses"
                    placeholder="Select the project courses"
                    data={courses.isLoading ? [] : formattedCourses}
                    register={register("courses", { required: true })}
                    control={control}
                    errors={errors.courses && "Project courses are required"}
                    toolbar={
                        <Button
                            type="button"
                            className="!p-1 !rounded-full"
                            variant="ghost"
                            onClick={handleViewNewCourse}
                        >
                            <PlusIcon className="h-4 w-4 text-nextcolor" aria-hidden="true" />
                        </Button>
                    }
                />
                <CompetenciesContainer
                    selectedCourses={selectedCourses}
                    setValue={setValue}
                    toolbar={
                        <Button
                            type="button"
                            className="!p-1 !rounded-full"
                            variant="ghost"
                            onClick={handleViewNewCompetency}
                        >
                            <PlusIcon className="h-4 w-4 text-nextcolor" aria-hidden="true" />
                        </Button>
                    }
                />
                <div className="flex justify-between items-center">
                    <CreditCounter domain={selectedDomain} credits={selectedCoursesCredits} />
                    <Button className="!rounded-full" type="submit">
                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                        Add course
                    </Button>
                </div>
            </form>
        </div>
    );
}
