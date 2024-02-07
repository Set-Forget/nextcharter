import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SearchSelect from "../../../components/SearchSelect";
import useInfo from "../../../hooks/useInfo";
import { closeModal } from "../../../store/modalState";

export default function NewDomain({ institutions }) {
    const [loading, setLoading] = useState(false);

    const { insertToDatabase } = useInfo();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm();

    const handleCancel = () => {
        closeModal();
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const insertedData = await insertToDatabase(
                {
                    name: data.domainName,
                    credits_required: null,
                },
                "domain"
            );
            await insertToDatabase(
                {
                    institution_id: data.institution.id,
                    domain_id: insertedData[0].id,
                },
                "institution_domain"
            );
        } catch (error) {
            throw new Error(error);
        } finally {
            reset();
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-4">
            <SearchSelect
                name="institution"
                label="Institution"
                placeholder="Select the domain institution"
                data={institutions.isLoading ? [] : institutions.data}
                register={register("institution", { required: true })}
                control={control}
                errors={errors.institution && "Domain institution is required"}
            />
            <Input
                label="Domain name"
                placeholder="Enter the domain name"
                register={register("domainName", { required: true })}
                errors={errors.domainName && "Domain name is required"}
            />
            <div className="mt-4 grid grid-flow-row-dense grid-cols-2 gap-3">
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
