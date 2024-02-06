import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";
import Input from "../../../components/InputV2";
import SearchSelect from "../../../components/SearchSelect";
import useInfo from "../../../hooks/useInfo";
import { closeModal } from "../../../store/modalState";

export default function NewCompetency({ institutions, domains, institutionDomains, courses }) {
    const [loading, setLoading] = useState(false);

    const { insertToDatabase } = useInfo();

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    const handleCancel = () => {
        closeModal();
    };

    const onSubmit = async (data) => {
        setLoading(true);

        const competencyList = data.competencyName.split(",").map((item) => ({
            name: item.trim(),
        }));

        try {
            const competencyData = await insertToDatabase(competencyList, "competency");

            const competencyCourseList = competencyData.map((competency) => ({
                competency_id: competency.id,
                course_id: data.courses.id,
            }));

            await insertToDatabase(competencyCourseList, "competency_course");
        } catch (error) {
            throw new Error(error);
        } finally {
            reset();
            setLoading(false);
        }
    };

    const selectedInstitution = watch("institution");
    const selectedDomain = watch("domains");

    const filteredDomainIds = institutionDomains?.data
        ?.filter((item) => item.institution_id === selectedInstitution?.id)
        .map((item) => item.domain_id);

    const filteredDomains = domains?.data?.filter(
        (domain) => filteredDomainIds.includes(domain.id) && domain.name
    );

    const formattedDomains = filteredDomains?.map((domain) => ({
        id: domain.id,
        name: domain.name,
        institutionDomainId: institutionDomains?.data?.find((item) => item.domain_id === domain.id)?.id,
    }));

    const formattedCourses = courses?.data
        ?.map((course) => ({
            id: course.id,
            name: course.name,
            domainId: course.inst_domain_id,
            credits: course.credits,
        }))
        .filter((course) => course.domainId === selectedDomain?.id);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-4">
            <SearchSelect
                name="institution"
                label="Institution"
                placeholder="Select the competency institution"
                data={institutions.isLoading ? [] : institutions.data}
                register={register("institution", { required: true })}
                control={control}
                errors={errors.institution && "Competency institution is required"}
            />
            <SearchSelect
                name="domains"
                label="Domains"
                placeholder="Select the competency domains"
                data={formattedDomains}
                register={register("domains", { required: true })}
                control={control}
                errors={errors.domains && "Competency domains are required"}
            />
            <SearchSelect
                name="courses"
                label="Courses"
                placeholder="Select the competency course"
                data={courses.isLoading ? [] : formattedCourses}
                register={register("courses", { required: true })}
                control={control}
                errors={errors.courses && "Competency course are required"}
            />
            <Input
                label="Competency name"
                placeholder="Enter the competency name"
                register={register("competencyName", { required: true })}
                errors={errors.competencyName && "Competency name is required"}
            />

            <div className="mt-4 grid grid-flow-row-dense grid-cols-2 gap-4">
                <Button isLoading={loading} type="submit">
                    Save
                </Button>
                <Button variant="secondary" onClick={handleCancel} type="button">
                    Cancel
                </Button>
            </div>
        </form>
    );
}
