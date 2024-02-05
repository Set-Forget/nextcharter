import { useEffect, useMemo, useState } from "react";

// COMPONENTS
import SelectWithCheck from "../components/SelectWithCheck";
import Fieldset from "../components/Fieldset";
import ComboBoxSimple from "../components/ComboBoxSimple";
import ResumeItem from "../components/ResumeItem";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import AddDomainModal from "../components/AddDomainModal";
import AddCourseModal from "../components/AddCourseModal";
import AddCompetencyModal from "../components/AddCompetencyModal";

// HOOKS
import useInfo from "../hooks/useInfo";
import useModal from "../hooks/useModal";
import { supabase } from "../lib/api";

function sumCreditValues(data) {
    const creditTotal = data.reduce((accumulator, item) => accumulator + item.credits, 0);
    return creditTotal;
}

function groupByCourseId(data) {
    const grouped = data.reduce((acc, obj) => {
        if (!acc[obj.course_id]) {
            acc[obj.course_id] = [];
        }
        acc[obj.course_id].push(obj);
        return acc;
    }, {});

    return Object.values(grouped);
}

const initialFormData = {
    selectedStudent: null,
    list: [],
};

export default function Home() {
    const [postLoading, setPostLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [selectedDomain, setSelectedDomain] = useState({ name: "Select" });
    const [selectedCourse, setSelectedCourse] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [registered, setRegistered] = useState([]);
    const [open, setOpen] = useState({ value: false, message: "" });
    const [domainTableData, setDomainTableData] = useState([]);
    const [instDomainTableData, setInstDomainTableData] = useState([]);

    const {
        students,
        institutions,
        domains,
        courses,
        competencies,
        getDomains,
        getCourses,
        getCompetencies,
        insertCompetencies,
        deleteCompetencies,
        getRegisters,
        isLoading,
        error,
    } = useInfo();

    const { isShowing, toggle } = useModal();
    const { isShowing: courseIsShowing, toggle: courseToggle } = useModal();
    const { isShowing: competencyIsShowing, toggle: competencyToggle } = useModal();

    const competenciesGrouped = useMemo(() => groupByCourseId(competencies), [competencies]);

    const totalCredits = useMemo(() => {
        return formData.list.reduce((total, domain) => {
            const domainTotal = domain.selectedCourse.reduce(
                (accumulator, item) => accumulator + item.credits,
                0
            );

            return domainTotal;
        }, 0);
    }, [formData]);

    const handleAdd = () => {
        setFormData((prevState) => {
            if (prevState.selectedStudent) {
                return {
                    ...prevState,
                    list: [
                        ...prevState.list,
                        {
                            selectedDomain,
                            selectedCourse,
                            competencies,
                        },
                    ],
                };
            } else {
                return {
                    ...prevState,
                    selectedStudent,
                    list: [
                        ...prevState.list,
                        {
                            selectedDomain,
                            selectedCourse,
                            competencies,
                        },
                    ],
                };
            }
        });
        setSelectedDomain({ name: "Select" });
        setSelectedCourse([]);
    };

    function deleteDomainFromList(index) {
        setFormData((prevState) => ({
            ...prevState,
            selectedStudent: prevState.list.length === 1 ? null : prevState.selectedStudent,
            list: [...prevState.list.slice(0, index), ...prevState.list.slice(index + 1)],
        }));
    }

    function handleSetDomain(e) {
        setSelectedCourse([]);
        setSelectedDomain(e);
        getCourses(e.inst_domain_id);
    }

    function handleSetStudent(e) {
        setSelectedDomain({ name: "Select" });
        setSelectedCourse([]);
        setSelectedStudent(e);
    }

    function handleSetInstitution(e) {
        setSelectedDomain({ name: "Select" });
        setSelectedCourse([]);
        setSelectedInstitution(e);
        getDomains(e.id);
    }

    function clearForm() {
        setSelectedStudent(null);
        setSelectedDomain({ name: "Select" });
        setSelectedCourse([]);
        setFormData(initialFormData);
    }

    const registerFunction = (result) => {
        const groupedByDomain = result.reduce((acc, item) => {
            if (!acc[item.domain_name]) {
                acc[item.domain_name] = {
                    selectedDomain: {
                        name: item.domain_name,
                    },
                    selectedCourses: [],
                    credits: item.competency_course.credit_value,
                    competency_course_ids: [item.id],
                };
            } else {
                (acc[item.domain_name].credits = item.competency_course.credit_value),
                    acc[item.domain_name].competency_course_ids.push(item.id);
            }

            if (!acc[item.domain_name].selectedCourses.some((course) => course.name === item.course_name)) {
                acc[item.domain_name].selectedCourses.push({
                    name: item.course_name,
                    credits: item.competency_course.credit_value,
                });
            }

            return acc;
        }, {});
        const list = Object.values(groupedByDomain);
        setRegistered(list);
    };

    const handleDelete = async (ids) => {
        const result = await deleteCompetencies(ids);
        getRegisters(selectedStudent.id).then(registerFunction);
    };

    const handleSubmit = async () => {
        const list = [];
        if (selectedInstitution.name == "Other") {
            formData.list.forEach((item) => {
                item.selectedCourse.forEach((course) => {
                    const competenciesFiltered = item.competencies.filter(
                        (competency) => competency.course_id === course.id
                    );
                    competenciesFiltered.forEach((competency) => {
                        const element = {
                            student_id: formData.selectedStudent.id,
                            student_code: formData.selectedStudent.code,
                            domain_name: item.selectedDomain.name,
                            course_name: course.name,
                            competency_name: competency.name,
                            competency_id: competency.competency_id,
                            competency_course_id: competency.id,
                            status: "transfer",
                        };
                        list.push(element);
                    });
                });
            });
        } else {
            formData.list.forEach((item) => {
                item.selectedCourse.forEach((course) => {
                    const competenciesFiltered = item.competencies.filter(
                        (competency) => competency.course_id === course.id
                    );
                    competenciesFiltered.forEach((competency) => {
                        const element = {
                            student_id: formData.selectedStudent.id,
                            student_code: formData.selectedStudent.code,
                            domain_name: item.selectedDomain.name,
                            course_name: course.name,
                            competency_name: competency.name,
                            competency_id: competency.competency_id,
                            competency_course_id: competency.id,
                        };
                        list.push(element);
                    });
                });
            });
        }
        setPostLoading(true);
        const { error, status } = await insertCompetencies(list);
        setPostLoading(false);
        if (status >= 200 && status < 300) {
            clearForm();
        }
    };

    useEffect(() => {
        if (selectedCourse.length) {
            const ids = selectedCourse.map((item) => item.id);
            getCompetencies(ids);
        } else {
            getCompetencies([]);
        }
    }, [selectedCourse, getCompetencies]);

    useEffect(() => {
        if (selectedStudent) {
            getRegisters(selectedStudent.id).then(registerFunction);
        }
    }, [selectedStudent]);

    useEffect(() => {
        async function fetchData() {
            if (domains != undefined && domains.length >= 1) {
                try {
                    // Fetch domainTable data
                    const { data: domainTable } = await supabase.from("domain").select();
                    setDomainTableData(domainTable);

                    // Fetch instDomainTable data
                    const { data: instDomainTable } = await supabase.from("institution_domain").select();
                    setInstDomainTableData(instDomainTable);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        }

        fetchData();
    }, [domains]); // domains as a dependency

    if (postLoading || isLoading) return <Spinner />;
    if (error) return <p>Error!</p>;

    return (
        <>
            <Alert open={open} setOpen={setOpen} action={handleDelete} />
            <AddDomainModal isShowing={isShowing} toggle={toggle} />
            <AddCourseModal isShowing={courseIsShowing} toggle={courseToggle} />
            <AddCompetencyModal isShowing={competencyIsShowing} toggle={competencyToggle} />
            <main className="flex-1 bg-white place-items-center p-4 relative container mx-auto">
                <div className="h-[calc(100vh-115px)] mt-20 rounded-lg shadow flex">
                    <div className="flex flex-col flex-1 px-8 py-4">
                        <form className="mb-4">
                            <ComboBoxSimple
                                label="Student"
                                disabled={formData.selectedStudent}
                                people={students}
                                selectedPerson={selectedStudent}
                                setSelectedPerson={handleSetStudent}
                            />
                            <br />
                            <ComboBoxSimple
                                label="Institution"
                                // disabled={formData.selectedStudent}
                                people={institutions}
                                selectedPerson={selectedInstitution}
                                setSelectedPerson={handleSetInstitution}
                            />
                            <br />
                            <SelectWithCheck
                                label="Domains"
                                people={domains || []}
                                selected={selectedDomain}
                                setSelected={handleSetDomain}
                                handleAdd={toggle}
                                domainTableData={domainTableData}
                                instDomainTableData={instDomainTableData}
                            />
                            <br />
                            <SelectWithCheck
                                label="Course"
                                people={courses || []}
                                selected={selectedCourse}
                                setSelected={setSelectedCourse}
                                handleAdd={courseToggle}
                                multiple
                            />
                        </form>
                        <label className="text-sm font-medium leading-6 text-gray-900 flex items-center">
                            Compentencies
                            <svg
                                className="h-3 w-3 ml-1 bg-nextcolor rounded-full cursor-pointer"
                                viewBox="0 0 20 20"
                                fill="#fff"
                                aria-hidden="true"
                                onClick={competencyToggle}
                            >
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                            </svg>
                        </label>
                        <div className="flex-1 bg-gray-100 no-scrollbar overflow-y-auto">
                            {competenciesGrouped.map((filters, index) => (
                                <Fieldset key={index} items={filters} label="Competencies" />
                            ))}
                        </div>
                        <br />
                        <div className="flex justify-between items-center mb-1">
                            {selectedDomain.name !== "Select" ? (
                                <p className="block text-sm font-medium leading-6">
                                    {selectedDomain.name} credits attached: {sumCreditValues(selectedCourse)}
                                </p>
                            ) : (
                                <p></p>
                            )}
                            <button
                                disabled={
                                    selectedDomain.name === "Select" ||
                                    sumCreditValues(selectedCourse) < selectedDomain.credit_required
                                }
                                type="button"
                                onClick={handleAdd}
                                className="rounded-full bg-nextcolor p-2 disabled:opacity-50 text-white shadow-sm hover:bg-nextcolor focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 p-4 bg-gray-100 shadow h-full rounded">
                        <div className="flex-1 no-scrollbar overflow-y-auto pb-4">
                            <ul role="list" className="mt-3 grid grid-cols-1 gap-3">
                                {registered.length !== 0 &&
                                    registered.map((obj, i) => (
                                        <ResumeItem
                                            key={i}
                                            selectedStudent={selectedStudent}
                                            onDelete={() => {
                                                setOpen({
                                                    value: true,
                                                    message: obj.competency_course_ids.length,
                                                    ids: obj.competency_course_ids,
                                                });
                                            }}
                                            domainName={obj.selectedDomain.name}
                                            selectedCourse={obj.selectedCourses}
                                            exist
                                        />
                                    ))}
                                {formData.selectedStudent &&
                                    formData.list.map((obj, i) => (
                                        <ResumeItem
                                            key={i}
                                            selectedStudent={formData.selectedStudent}
                                            onDelete={() => deleteDomainFromList(i)}
                                            domainName={obj.selectedDomain.name}
                                            selectedCourse={obj.selectedCourse}
                                        />
                                    ))}
                            </ul>
                        </div>
                        <div className="flex">
                            <h3
                                className={`${
                                    totalCredits >= 20
                                        ? "text-green-500"
                                        : totalCredits == 0
                                        ? "text-gray-400"
                                        : "text-red-500"
                                } p-2 font-semibold rounded-xl mb-2 shadow-md bg-white`}
                            >
                                Total credits:{" "}
                                {totalCredits +
                                    registered
                                        .map((item) => item.selectedCourses)
                                        .reduce((acc, cv) => acc.concat(cv), [])
                                        .reduce((acc, cv) => cv.credits + acc, 0)}{" "}
                                / 20
                            </h3>
                        </div>
                        <button
                            type="button"
                            disabled={!formData.selectedStudent}
                            onClick={handleSubmit}
                            className="disabled:opacity-50 h-12 rounded-md bg-nextcolor px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-nextcolor focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
