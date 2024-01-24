import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import Input from "../components/InputV2";
import MultiSelect from "../components/MultiSelectV2";
import SearchSelect from "../components/SearchSelect";
import useGetData from "../hooks/useGetData";
import useInfo from "../hooks/useInfo";
import { closeModal } from "../store/modalState";

export default function NewProject() {
    const competencies = useGetData("competency");
    const teachers = useGetData("teacher");

    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const { insertToDatabase } = useInfo();

    const formattedCompetencies = competencies.data.map((competency) => ({
        id: competency.id,
        name: competency.name,
    }));

    const formattedTeachers = teachers.data.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
    }));

    const onSubmit = async (data) => {
        setIsLoadingSubmit(true);
        try {
            const instertedProject = await insertToDatabase(
                {
                    name: data.projectName,
                    teacher_id: data.teacher.id,
                    teacher_name: data.teacher.name,
                    description: data.description,
                    comment: data.comments,
                },
                "project"
            );
            data.competencies.forEach(async (competency) => {
                await insertToDatabase(
                    {
                        project_id: instertedProject[0].id,
                        competency_id: competency.id,
                        competency_name: competency.name,
                    },
                    "project_competencies"
                );
            });
            setIsLoadingSubmit(false);
            closeModal();
        } catch (error) {
            throw new Error(error);
        }
    };

    return (
        <main className="flex-1 place-items-center relative">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mx-auto gap-4 flex flex-col items-center max-w-3xl"
            >
                <Input
                    label="Project name"
                    placeholder="Enter the project name"
                    register={register("projectName", { required: true })}
                    errors={errors.projectName && "Project name is required"}
                />
                <SearchSelect
                    name="teacher"
                    control={control}
                    label="Teacher"
                    register={register("teacher", { required: true })}
                    placeholder="Select a teacher"
                    data={teachers.isLoading ? [] : formattedTeachers}
                    errors={errors.teacher && "Teacher is required"}
                />
                <Input
                    label="Description"
                    placeholder="Enter the project description"
                    register={register("description", { required: true })}
                    errors={errors.description && "Project description is required"}
                />
                <MultiSelect
                    name="competencies"
                    label="Competencies"
                    placeholder="Select the project competencies"
                    data={competencies.isLoading ? [] : formattedCompetencies}
                    register={register("competencies", { required: true })}
                    control={control}
                    errors={errors.competencies && "Project competencies are required"}
                />
                <Input
                    label="Comments"
                    placeholder="Enter the project comments"
                    register={register("comments", { required: true })}
                    errors={errors.comments && "Project comments are required"}
                />
                <Button isLoading={isLoadingSubmit} className="mt-4" type="submit">
                    Submit
                </Button>
            </form>
        </main>
    );
}
