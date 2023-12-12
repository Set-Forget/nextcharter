import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

import ComboBoxSimple from "../components/ComboBoxSimple";
import Spinner from "../components/Spinner";

import useInfo from "../hooks/useInfo";

import "./StudentProgress.css";
import ProgressBar from "../components/ProgressBar";

function groupByDomainAndCourse(arr) {
  return arr.reduce((acc, item) => {
    // Creamos una clave única para agrupar por domain_name y course_name
    const key = `${item.domain_name}-${item.course_name}`;
    if (!acc[key]) {
      acc[key] = {
        student_id: item.student_id,
        student_name: item.student_name,
        domain_name: item.domain_name,
        course_name: item.course_name,
        competencies: [],
      };
    }

    acc[key].competencies.push({
      competency_name: item.competency_name,
      competency_id: item.competency_id,
      status: item.status,
    });

    return acc;
  }, {});
}

const groupByDomainName = (students) => {
  return students.reduce((acc, student) => {
    const domain = student.domain_name;
    // Si el dominio no existe en el acumulador, lo inicializamos con un array vacío
    if (!acc[domain]) {
      acc[domain] = [];
    }
    // Agregamos el estudiante al dominio correspondiente
    acc[domain].push(student);
    return acc;
  }, {});
};

const returnPercent = (groupedByDomainName) => {
  const lista = [];
  Object.keys(groupedByDomainName).forEach((clave) => {
    groupedByDomainName[clave].forEach((item) => {
      lista.push(...item.competencies);
    });
  });

  const totalCompetent = lista.filter((com) =>
    ["competent", "transfer"].includes(com.status)
  );
  const totalPercent = (totalCompetent.length * 100) / lista.length;

  return Math.round(totalPercent);
};

const colorPallete = {
  blank: {
    bg: "bg-white",
  },
  "plan to meet": {
    bg: "bg-blue-500",
    text: "text-white",
    tp: "text-blue-500",
  },
  "not meet": {
    bg: "bg-slate-500",
    text: "text-white",
    tp: "text-slate-500",
  },
  "attempting to meet": {
    bg: "bg-amber-400",
    text: "text-grey-500",
    tp: "text-amber-400",
  },
  competent: {
    bg: "bg-green-500",
    text: "text-white",
    tp: "text-green-500",
  },
  transfer: {
    bg: "bg-green-500",
    text: "text-white",
    tp: "text-green-500",
  },
};

export default function StudentProgress() {
  const { id } = useParams();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [params, setParams] = useState({ studentId: id });
  const [competencyByStudent, setCompetencyByStudent] = useState(null);
  const reportToPDF = useRef(null);

  const { students, isLoading, getRegistersByCode } = useInfo();

  function handleSelectStudent(e) {
    setSelectedStudent(e);
  }

  function handleFetch() {
    getRegistersByCode(selectedStudent.code).then((registers) => {
      setCompetencyByStudent(registers);
    });
  }

  const handleGeneratePDF = () => {
    let srcwidth = reportToPDF.current.scrollWidth;
    const doc = new jsPDF("p", "pt", "a4");

    //doc.setFont('Inter-Regular', 'normal');

    doc.html(reportToPDF.current, {
      html2canvas: {
        scale: 600 / srcwidth,
      },
      callback(doc) {
        doc.save("Student_report");
        // window.open(doc.output('bloburl'))
      },
    });
  };

  useEffect(() => {
    getRegistersByCode(id).then((registers) => {
      setCompetencyByStudent(registers);
    });
  }, []);

  if (isLoading) return <Spinner />;

  console.log(competencyByStudent);

  const groupedByDomainAndCourse =
    competencyByStudent &&
    Object.values(groupByDomainAndCourse(competencyByStudent));
  const groupedByDomainName =
    competencyByStudent && groupByDomainName(groupedByDomainAndCourse);
  const domainNameList =
    competencyByStudent && Object.keys(groupedByDomainName);
  const percentProgress =
    competencyByStudent && returnPercent(groupedByDomainName);

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 place-items-center pt-20 pr-4 pl-4">
      <div className="mb-8 mt-8 flex items-end">
        <ComboBoxSimple
          label="STUDENT"
          // disabled={formData.selectedStudent}
          people={students}
          selectedPerson={selectedStudent}
          setSelectedPerson={handleSelectStudent}
        />
        <button
          type="button"
          disabled={!selectedStudent}
          onClick={handleFetch}
          className="disabled:opacity-50 h-9 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
        >
          search
        </button>
        {/* <button
          type="button"
          disabled={!params.studentId}
          onClick={handleFetch}
          className="disabled:opacity-50 h-9 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2 right-0"
        >
          Edit
        </button> */}
        <button
          type="button"
          disabled={!params.studentId}
          onClick={handleGeneratePDF}
          className="disabled:opacity-50 h-9 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2 right-0"
        >
          Download PDF
        </button>
        <div className="flex flex-col ml-auto">
          {competencyByStudent.length !== 0 && percentProgress !== 0 && (
            <div className="ml-auto">
              <p>% of plan completed</p>
              <div className="shadow-md bg-grey-light w-[30rem] border-emerald-400 border-[0.5px] rounded">
                <div
                  className="bg-teal-500 text-xs leading-none py-[0.35rem] text-center text-white"
                  style={{ width: `${percentProgress}%` }}
                >
                  {percentProgress}%
                </div>
              </div>
            </div>
          )}
          {competencyByStudent.length !== 0 && (
            <ProgressBar
              selectedStudent={selectedStudent}
              competencyByStudent={competencyByStudent}
            />
          )}
        </div>
      </div>
      <div ref={reportToPDF}>
        {competencyByStudent &&
          domainNameList.map((key) => {
            return (
              <div
                key={key}
                className="shadow-md p-2 mb-8 rounded-l bg-white border-indigo-300 border-[0.5px] border-opacity-70"
              >
                <h2 className="mb-6 text-center text-indigo-500 font-semibold uppercase rounded w-[calc(6rem*3)] -mt-5 mx-auto bg-white border-indigo-300 border-[0.5px] border-opacity-70">
                  {key}
                </h2>
                {groupedByDomainName[key].map((courseItem) => {
                  const courseName = courseItem.course_name;
                  const { competencies } = courseItem;
                  const noCompetents = competencies.filter(
                    (i) => i.status !== "competent" && i.status !== "transfer"
                  );
                  const competents = competencies.filter(
                    (i) => i.status == "competent" || i.status == "transfer"
                  );
                  const completed = competents.length;

                  while (noCompetents.length < 8) {
                    noCompetents.unshift({
                      compentecy_name: "",
                      status: "blank",
                    });
                  }
                  while (competents.length < 8) {
                    competents.push({ compentecy_name: "", status: "blank" });
                  }

                  return (
                    <div
                      key={courseName}
                      className="flex gap-2 justify-center mb-4"
                    >
                      {noCompetents.map((ptm) => (
                        <div
                          className="relative inline-block tooltip"
                          key={ptm.id}
                        >
                          <div
                            className={`w-[4.6rem] h-16 ${
                              colorPallete[ptm.status].bg
                            } ${
                              colorPallete[ptm.status].text
                            } flex justify-center items-center rounded-md`}
                          >
                            {ptm.competency_name}
                          </div>
                          {ptm.status !== "blank" && (
                            <div
                              className={`flex ${colorPallete[ptm.status].bg} ${
                                colorPallete[ptm.status].text
                              } flex-col p-2 w-52 rounded-lg z-20 absolute right-0 invisible tooltip-item mt-2`}
                            >
                              <p className="text-sm capitalize">
                                <span className="font-semibold">Status</span>:{" "}
                                {ptm.status}
                              </p>
                              <p className="text-sm capitalize">
                                <span className="font-semibold">
                                  Belongs to
                                </span>
                                : {courseName}
                              </p>
                              <p className="text-sm capitalize">{`(${completed}/${competencies.length})`}</p>
                              <svg
                                className={`absolute ${
                                  colorPallete[ptm.status].tp
                                } -top-3 h-8 right-0 mr-3`}
                                x="0px"
                                y="0px"
                                viewBox="0 0 255 255"
                                xmlSpace="preserve"
                              >
                                <polygon
                                  className="fill-current"
                                  points="50,0 100,100 0,100"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="min-w-[6rem] w-[6rem] rounded-md h-16 bg-white border-2 border-indigo-600 text-indigo-600 flex justify-center items-center text-center font-bold">
                        {courseName}
                      </div>
                      {competents.map((ptm) => (
                        <div
                          className="relative inline-block tooltip"
                          key={ptm.id}
                        >
                          <div
                            className={`w-[4.6rem] h-16 ${
                              colorPallete[ptm.status].bg
                            } ${
                              colorPallete[ptm.status].text
                            } flex justify-center items-center rounded-md`}
                          >
                            {ptm.competency_name}
                          </div>
                          {ptm.status !== "blank" && (
                            <div
                              className={`flex ${colorPallete[ptm.status].bg} ${
                                colorPallete[ptm.status].text
                              } flex-col p-2 w-56 rounded-lg z-20 absolute right-0 invisible tooltip-item mt-2`}
                            >
                              <p className="text-sm capitalize">
                                <span className="font-semibold">Status</span>:{" "}
                                {ptm.status}
                              </p>
                              <p className="text-sm capitalize">
                                <span className="font-semibold">
                                  Belongs to
                                </span>
                                : {courseName}
                              </p>
                              <p className="text-sm capitalize">{`(${completed}/${competencies.length})`}</p>
                              <svg
                                className={`absolute ${
                                  colorPallete[ptm.status].tp
                                } -top-3 h-8 right-0 mr-3`}
                                x="0px"
                                y="0px"
                                viewBox="0 0 255 255"
                                xmlSpace="preserve"
                              >
                                <polygon
                                  className="fill-current"
                                  points="50,0 100,100 0,100"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </main>
  );
}
