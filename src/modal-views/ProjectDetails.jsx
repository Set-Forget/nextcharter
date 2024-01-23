import Button from "../components/Button";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/solid";
import { closeModal, setModalState } from "../store/modalState";
import EditProject from "./EditProject";
import { useAuthContext } from "../context/AuthProvider";
import useGetDataById from "../hooks/useGetDataById";
import { useState } from "react";
import useInfo from "../hooks/useInfo";

export default function ProjectDetails({ data }) {
    const { name, competencies, teacher_name, teacher_id, description, comment } = data;

    const [loading, setLoading] = useState(false);

    const userRole = localStorage.getItem("userRole");

    const { session } = useAuthContext();
    const { insertToDatabase } = useInfo();
    const teacher = useGetDataById("teacher", teacher_id);

    const teacher_email = !teacher.isLoading && teacher.data[0].email;
    const auth_email = session?.user?.email;

    const isAllowed = userRole === "admin" || teacher_email === auth_email;

    const competencies_name = competencies.map(({ name }) => name);

    const handleEditProject = () => {
        setModalState({
            open: true,
            payload: null,
            view: <EditProject data={data} />,
            title: "Edit project",
            subtitle: "Edit the project details",
        });
    };

    const handleApplyProject = async () => {
        setLoading(true);
        try {
            await insertToDatabase(
                {
                    project_id: data.id,
                    student_email: session.user.email,
                },
                "project_students"
            );
            setLoading(false);
            closeModal();
        } catch (error) {
            throw new Error(error);
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
                <div className="mt-4">
                    <Button onClick={handleEditProject} className="w-full">
                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                        Edit project
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
