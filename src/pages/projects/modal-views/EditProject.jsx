import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import MultiSelect from "../../../components/MultiSelect";
import SearchSelect from "../../../components/SearchSelect";
import useGetData from "../../../hooks/useGetData";
import useInfo from "../../../hooks/useInfo";
import { closeModal, setModalState } from "../../../store/modalState";
import ProjectDetails from "./ProjectDetails";
import { setToastState } from "../../../store/toastState";

export default function EditProject({ data }) {
    const { name, teacher, description, comment, id } = data;

    const [loading, setLoading] = useState(false);

    const teachers = useGetData("teacher");
    const competencies = useGetData("competency");

    const { updateDatabase, deleteFromDatabase, insertToDatabase } = useInfo();

    const formattedCompetencies = competencies.data.map((competency) => ({
        id: competency.id,
        name: competency.name,
    }));

    const formattedTeachers = teachers.data.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
    }));

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            projectName: name,
            teacher: teacher,
            competencies: data.competencies,
            description,
            comments: comment,
        },
    });

    const handleCancel = () => {
        closeModal();
    };

    const onSubmit = async (data) => {
        setLoading(true);

        const formattedData = {
            ...data,
            name: data.projectName,
            teacher_id: data.teacher.id,
            teacher_name: data.teacher.name,
            description: data.description,
            comment: data.comments,
            competencies: data.competencies,
            id,
        };

        const formattedCompetencies = data.competencies.map((competency) => ({
            project_id: id,
            competency_id: competency.id,
            competency_name: competency.name,
        }));

        try {
            await updateDatabase(
                id,
                {
                    name: data.projectName,
                    teacher_id: data.teacher.id,
                    teacher_name: data.teacher.name,
                    description: data.description,
                    comment: data.comments,
                },
                "project"
            );
            await deleteFromDatabase("project_id", id, "project_competencies");
            await insertToDatabase(formattedCompetencies, "project_competencies");

            setModalState({
                open: true,
                payload: null,
                view: <ProjectDetails data={formattedData} />,
                title: "Edit project",
                subtitle: "Edit the project details",
            });
            setToastState({
                open: true,
                title: "The project has been updated successfully",
                type: "success",
            });
        } catch (error) {
            setToastState({
                open: true,
                title: "An error occurred while updating the project",
                type: "error",
            });
            throw new Error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900 text-left">Project name</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-left">
                        <Input
                            placeholder="Enter the project name"
                            register={register("projectName", { required: true })}
                            errors={errors.projectName && "Project name is required"}
                        />
                    </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900 text-left">
                        Assigned teacher
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-left">
                        <SearchSelect
                            name="teacher"
                            control={control}
                            register={register("teacher", { required: true })}
                            placeholder="Select a teacher"
                            data={teachers.isLoading ? [] : formattedTeachers}
                            errors={errors.teacher && "Teacher is required"}
                        />
                    </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900 text-left">Competencies</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-left">
                        <MultiSelect
                            name="competencies"
                            placeholder="Select the project competencies"
                            data={competencies.isLoading ? [] : formattedCompetencies}
                            register={register("competencies", { required: true })}
                            control={control}
                            errors={errors.competencies && "Project competencies are required"}
                        />
                    </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900 text-left">Description</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-left">
                        <Input
                            placeholder="Enter the project description"
                            register={register("description", { required: true })}
                            errors={errors.description && "Project description is required"}
                        />
                    </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900 text-left">Comments</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-left">
                        <Input
                            placeholder="Enter the project comments"
                            register={register("comments", { required: true })}
                            errors={errors.comments && "Project comments are required"}
                        />
                    </dd>
                </div>
            </dl>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
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
