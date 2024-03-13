import {
    AcademicCapIcon,
    ChevronRightIcon,
    DocumentChartBarIcon,
    EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import Menu from "../../../components/Menu";
import useGetFilterData from "../../../hooks/useGetFilterData";
import { closeModal, getModalState, setModalState } from "../../../store/modalState";
import Avatar from "../../../components/Avatar";
import { useAuthContext } from "../../../context/AuthProvider";
import { supabase } from "../../../lib/api";
import UpdateProjectCompetencies from "./UpdateProjectCompetencies";

export default function ProjectStudents() {
    const { user } = useAuthContext();

    const navigate = useNavigate();

    const projectId = getModalState().payload?.id;
    const userRole = user.role;

    const [studentsData, setStudentsData] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(true);

    const assignedStudents = useGetFilterData("project_students", "project_id", projectId);
    const assignedStudentEmails = assignedStudents.data.map((student) => student.student_email);

    const getStudentData = async () => {
        try {
            const { data } = await supabase.from("student").select().in("email", assignedStudentEmails);
            return setStudentsData(data);
        } catch (error) {
            throw new Error(error);
        } finally {
            setStudentsLoading(false);
        }
    };

    const handleViewUpdateCompetencies = (studentEmail) => {
        setModalState({
            open: true,
            payload: { studentEmail, projectId },
            view: <UpdateProjectCompetencies />,
            title: "Update competencies",
            subtitle: "Update the competencies of the students assigned to this project",
            previous: {
                payload: { id: projectId },
                view: <ProjectStudents />,
                title: "Students view",
                subtitle: "A detailed view of the students assigned to the project",
            },
        });
    };

    const handleViewStudent = (code) => {
        navigate(`/profile/${code}`);
        closeModal();
    };

    useEffect(() => {
        if (assignedStudents.isLoading) return;
        getStudentData();
    }, [assignedStudents.isLoading]);

    return (
        <div className="mt-6">
            <ul role="list" className="divide-y divide-gray-100">
                {studentsLoading ? (
                    <div className="h-1 w-full overflow-hidden">
                        <div className="animate-progress w-full h-full bg-nextcolor origin-left-right"></div>
                    </div>
                ) : studentsData.length > 0 ? (
                    studentsData.map((student) => (
                        <li key={student.email} className="flex justify-between items-center gap-x-6 py-5">
                            <div className="flex min-w-0 gap-x-4">
                                <Avatar name={student.name} lastname={student.lastname} />
                                <div className="min-w-0 flex-auto">
                                    <p className="text-sm font-semibold leading-6 text-gray- text-left">
                                        {student.name} {student.lastname}
                                    </p>
                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                        {student.email}
                                    </p>
                                </div>
                            </div>
                            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                {userRole === "student" && student.email === user.email ? (
                                    <Button
                                        onClick={() => handleViewStudent(student.code)}
                                        className="!p-2 !rounded-full"
                                        variant="ghost"
                                    >
                                        <ChevronRightIcon className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    userRole !== "student" && (
                                        <Menu
                                            icon={<EllipsisVerticalIcon className="h-5 w-5" />}
                                            className="!p-1.5 !rounded-full"
                                            variant="ghost"
                                            options={[
                                                /*                                                 {
                                                    name: "View student",
                                                    icon: ({ className }) => (
                                                        <AcademicCapIcon className={className} />
                                                    ),
                                                    onClick: () => handleViewStudent(student.code),
                                                }, */
                                                {
                                                    name: "Update competencies",
                                                    icon: ({ className }) => (
                                                        <DocumentChartBarIcon className={className} />
                                                    ),
                                                    onClick: () =>
                                                        handleViewUpdateCompetencies(student.email),
                                                },
                                            ]}
                                        />
                                    )
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-gray-500">
                            There are no students assigned to this project yet
                        </span>
                        <AcademicCapIcon className="h-7 w-7 text-gray-500" />
                    </div>
                )}
            </ul>
        </div>
    );
}
