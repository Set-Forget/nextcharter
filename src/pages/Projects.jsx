import Button from "../components/Button";
import Table from "../components/TableV2";
import useGetData from "../hooks/useGetData";
import ProjectDetails from "../modal-views/ProjectDetails";
import { setModalState } from "../store/modalState";

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
    const projects = useGetData("project");
    const competencies = useGetData("competency");

    const handleViewProject = (id) => {
        const projectData = projects.data.find((project) => project.id === id);
        const adaptedProjectData = {
            ...projectData,
            teacher: {
                name: projectData.teacher_name,
                id: projectData.teacher_id,
            },
            competencies: competencies.data
                .filter((competency) => projectData.competencies_id.includes(competency.id))
                .map((competency) => {
                    return {
                        name: competency.name,
                        id: competency.id,
                    };
                }),
        };

        setModalState({
            open: true,
            payload: { id },
            view: <ProjectDetails data={adaptedProjectData} />,
            title: "Project view",
            subtitle: "A detailed view of the project",
        });
    };

    const data = projects.data.map((project) => {
        const projectName = project.name;
        const teacher = project.teacher_name;
        const action = (
            <Button onClick={() => handleViewProject(project.id)} variant="link">
                View project
            </Button>
        );

        const projectCompetencies = competencies.data
            .filter((competency) => project.competencies_id.includes(competency.id))
            .map((competency) => competency.name)
            .join(", ");

        return { projectName, teacher, projectCompetencies, action };
    });

    return (
        <div className="flex-1 overflow-y-auto bg-gray-100 place-items-center pt-20 relative">
            <Table
                columns={columns}
                data={data}
                title={TABLE_TITLE}
                isLoading={projects.isLoading || competencies.isLoading}
                subtitle={TABLE_SUBTITLE}
            />
        </div>
    );
}
