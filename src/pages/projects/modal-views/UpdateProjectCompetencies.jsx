import { useForm } from "react-hook-form";
import MultiSelect from "../../../components/MultiSelect";
import Select from "../../../components/Select";
import Button from "../../../components/Button";
import { getModalState, setModalState } from "../../../store/modalState";
import useGetFilterData from "../../../hooks/useGetFilterData";
import { supabase } from "../../../lib/api";
import { useState } from "react";
import ProjectStudents from "./ProjectStudents";
import { setToastState } from "../../../store/toastState";

export default function UpdateProjectCompetencies() {
    const { studentEmail, projectId } = getModalState().payload || {};

    const [loading, setLoading] = useState(false);

    const competencies = useGetFilterData("project_competencies", "project_id", projectId);

    const formattedCompetencies = competencies.data.map((competency) => ({
        id: competency.competency_id,
        name: competency.competency_name,
    }));

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await supabase
                .from("project_registers")
                .update({ status: data.status.value })
                .eq("student_email", studentEmail)
                .in(
                    "competency_id",
                    data.competencies.map((competency) => competency.id)
                );
            setModalState({
                open: true,
                payload: { id: projectId },
                view: <ProjectStudents />,
                title: "Students view",
                subtitle: "A detailed view of the students assigned to the project",
            });
            setToastState({
                open: true,
                title: "The project competencies have been updated successfully",
                type: "success",
            });
        } catch (error) {
            setToastState({
                open: true,
                title: "An error occurred while updating the project competencies",
                type: "error",
            });
            throw new Error(error.message);
        } finally {
            setLoading(false);
            reset();
        }
    };

    return (
        <div className="mt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="gap-4 flex flex-col items-center">
                <MultiSelect
                    name="competencies"
                    label="Competencies"
                    placeholder="Select the project competencies"
                    data={competencies.isLoading ? [] : formattedCompetencies}
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
                <Button isLoading={loading} className="mt-4" type="submit">
                    Submit
                </Button>
            </form>
        </div>
    );
}
