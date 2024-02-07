import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SearchSelect from "../../../components/SearchSelect";
import useInfo from "../../../hooks/useInfo";
import { closeModal } from "../../../store/modalState";

export default function NewCourse({ institutions, domains, institutionDomains }) {
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
        try {
            await insertToDatabase(
                {
                    name: data.courseName,
                    inst_domain_id: data.domains.institutionDomainId,
                    credits: data.creditsRequired,
                },
                "course"
            );
        } catch (error) {
            throw new Error(error);
        } finally {
            reset();
            setLoading(false);
        }
    };

    const selectedInstitution = watch("institution");

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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-4">
            <SearchSelect
                name="institution"
                label="Institution"
                placeholder="Select the course institution"
                data={institutions.isLoading ? [] : institutions.data}
                register={register("institution", { required: true })}
                control={control}
                errors={errors.institution && "Course institution is required"}
            />
            <SearchSelect
                name="domains"
                label="Domains"
                placeholder="Select the course domains"
                data={formattedDomains}
                register={register("domains", { required: true })}
                control={control}
                errors={errors.domains && "Course domains are required"}
            />
            <div className="flex gap-4">
                <Input
                    label="Course name"
                    placeholder="Enter the course name"
                    register={register("courseName", { required: true })}
                    errors={errors.courseName && "Course name is required"}
                    className="w-full"
                />
                <Input
                    label="Credits required"
                    type="number"
                    placeholder="Enter the credits required"
                    register={register("creditsRequired", { required: true })}
                    errors={errors.creditsRequired && "Credits required is required"}
                    className="w-full"
                />
            </div>
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
