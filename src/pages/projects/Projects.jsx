import {
    AcademicCapIcon,
    ChevronRightIcon,
    EllipsisHorizontalIcon,
    PlusIcon,
} from "@heroicons/react/24/solid";
import Button from "../../components/Button";
import Menu from "../../components/Menu";
import Table from "../../components/Table";
import useGetData from "../../hooks/useGetData";
import { setModalState } from "../../store/modalState";
import NewProject from "./modal-views/NewProject";
import ProjectDetails from "./modal-views/ProjectDetails";
import ProjectStudents from "./modal-views/ProjectStudents";
import { useAuthContext } from "../../context/AuthProvider";

const columns = [
    {
        name: "Project name",
        accessor: "projectName",
    },
    {
        name: "Teacher",
        accessor: "teacher",
    },
    {
        name: "Compentencies",
        accessor: "projectCompetencies",
    },
    {
        name: "Actions",
        accessor: "action",
    },
];

const TABLE_TITLE = "Projects";
const TABLE_SUBTITLE =
    "A list of all the projects in your account including their name, assigned teacher and compentencies.";

export default function Projects() {
    const { user } = useAuthContext();

    const projects = useGetData("project", true);
    const projectsCompetencies = useGetData("project_competencies", true);

    const userRole = user.role;

    const isAllowedToCreateProject = userRole === "admin" || userRole === "teacher";

    const handleViewProject = (id) => {
        const projectData = projects.data.find((project) => project.id === id);

        const adaptedProjectData = {
            ...projectData,
            teacher: {
                name: projectData.teacher_name,
                id: projectData.teacher_id,
            },
            competencies: projectsCompetencies.data
                .filter((projectCompetency) => projectCompetency.project_id === projectData.id)
                .map((projectCompetency) => ({
                    name: projectCompetency.competency_name,
                    id: projectCompetency.competency_id,
                })),
        };

        setModalState({
            open: true,
            payload: { id },
            view: <ProjectDetails data={adaptedProjectData} />,
            title: "Project view",
            subtitle: "A detailed view of the project",
        });
    };

    const handleViewStudents = (id) => {
        setModalState({
            open: true,
            payload: { id },
            view: <ProjectStudents />,
            title: "Students view",
            subtitle: "A detailed view of the students assigned to the project",
        });
    };

    const handleCreateProject = () => {
        setModalState({
            open: true,
            view: <NewProject />,
            title: "Create project",
            subtitle: "Create a new project",
        });
    };

    const data = projects.data.map((project) => {
        const projectName = project.name;
        const teacher = project.teacher_name;
        const action = (
            <Menu
                icon={<EllipsisHorizontalIcon className="h-5 w-5" />}
                className="!p-1.5 !rounded-full"
                variant="ghost"
                options={[
                    {
                        name: "View details",
                        onClick: () => handleViewProject(project.id),
                        icon: ({ className }) => <ChevronRightIcon className={className} />,
                    },
                    {
                        name: "View students",
                        onClick: () => handleViewStudents(project.id),
                        icon: ({ className }) => <AcademicCapIcon className={className} />,
                    },
                ]}
            />
        );

        const projectCompetencies = projectsCompetencies.data
            .filter((projectCompetency) => projectCompetency.project_id === project.id)
            .map((projectCompetency) => projectCompetency.competency_name)
            .join(", ");

        return { projectName, teacher, projectCompetencies, action };
    });

    return (
        <div className="flex-1 overflow-y-auto bg-gray-100 place-items-center pt-20 relative">
            <Table
                columns={columns}
                data={data}
                title={TABLE_TITLE}
                isLoading={projects.isLoading || projectsCompetencies.isLoading}
                subtitle={TABLE_SUBTITLE}
                toolbar={
                    isAllowedToCreateProject && (
                        <Button onClick={handleCreateProject}>
                            <PlusIcon className="h-5 w-5 mr-2" /> Create project
                        </Button>
                    )
                }
            />
        </div>
    );
}
