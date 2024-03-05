import Button from "../../../components/Button";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { closeModal, setModalState } from "../../../store/modalState";
import EditProject from "./EditProject";
import { useAuthContext } from "../../../context/AuthProvider";
import useGetDataById from "../../../hooks/useGetDataById";
import { useState } from "react";
import useInfo from "../../../hooks/useInfo";
import { setDialogState } from "../../../store/dialogState";
import { setToastState } from "../../../store/toastState";

export default function ProjectDetails({ data }) {
    const { user } = useAuthContext();

    const { name, competencies, teacher_name, teacher_id, description, comment } = data;

    const [loading, setLoading] = useState(false);

    const userRole = user.role;

    const { insertToDatabase, deleteFromDatabase } = useInfo();

    const teacher = useGetDataById("teacher", teacher_id);

    const teacher_email = !teacher.isLoading && teacher.data[0].email;
    const auth_email = user.email;

    const isAllowed = userRole === "admin" || teacher_email === auth_email;

    const competencies_name = competencies.map(({ name }) => name);

    const handleEditProject = () => {
        setModalState({
            open: true,
            payload: null,
            view: <EditProject data={data} />,
            title: "Edit project",
            subtitle: "Edit the project details",
            previous: {
                payload: { id: data.id },
                view: <ProjectDetails data={data} />,
                title: "Project details",
                subtitle: "A detailed view of the project",
            },
        });
    };

    const handleDeleteProject = () => {
        setDialogState({
            open: true,
            title: "Are you sure you want to delete this project?",
            description:
                "This project and its assigned students will be deleted. This action cannot be undone.",
            onConfirm: async () => {
                setLoading(true);
                try {
                    await deleteFromDatabase("id", data.id, "project");
                    await deleteFromDatabase("project_id", data.id, "project_competencies");
                    await deleteFromDatabase("project_id", data.id, "project_students");
                    closeModal();
                    setToastState({
                        open: true,
                        title: "The project has been deleted successfully",
                        type: "success",
                    });
                } catch (error) {
                    setToastState({
                        open: true,
                        title: "An error occurred while deleting the project",
                        type: "error",
                    });
                    throw new Error(error);
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const handleApplyProject = async () => {
        setLoading(true);
        try {
            await insertToDatabase(
                {
                    project_id: data.id,
                    student_email: user.email,
                },
                "project_students"
            );

            competencies.forEach(async (competency) => {
                await insertToDatabase(
                    {
                        competency_id: competency.id,
                        competency_name: competency.name,
                        student_email: user.email,
                        project_id: data.id,
                        status: "plan to meet",
                    },
                    "project_registers"
                );
            });
            closeModal();
            setToastState({
                open: true,
                title: "You have applied to the project successfully",
                type: "success",
            });
        } catch (error) {
            setToastState({
                open: true,
                title: "An error occurred while applying to the project",
                type: "error",
            });
            throw new Error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900 text-left">Project name</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-left">
                        {name}
                    </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900 text-left">
                        Assigned teacher
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-left">
                        {teacher_name}
                    </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900 text-left">Competencies</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-left">
                        {competencies_name.join(", ")}
                    </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900 text-left">Description</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-left">
                        {description}
                    </dd>
                </div>
                {isAllowed && (
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900 text-left">Comments</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-left">
                            {comment}
                        </dd>
                    </div>
                )}
            </dl>
            {isAllowed && (
                <div className="mt-4 flex gap-5">
                    <Button onClick={handleEditProject} className="w-full">
                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                        Edit project
                    </Button>
                    <Button
                        onClick={handleDeleteProject}
                        variant="ghost"
                        isLoading={loading}
                        className="w-full text-red-700 hover:!bg-red-600/5"
                    >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Delete project
                    </Button>
                </div>
            )}
            {userRole === "student" && (
                <div className="mt-4">
                    <Button onClick={handleApplyProject} isLoading={loading} className="w-full">
                        {!loading && <PlusIcon className="h-5 w-5 mr-2" />}
                        Apply to project
                    </Button>
                </div>
            )}
        </div>
    );
}
