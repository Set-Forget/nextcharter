import { useEffect, useRef, useState } from "react";
import useInfo from "../hooks/useInfo";
import Spinner from "../components/Spinner";
import SuccessAlert from "../components/SuccessAlert";
export default function EditCompetencies() {
  const [studentRegister, setStudentRegister] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState();
  const [selectedCompetency, setSelectedCompetency] = useState();
  const [selectedStatus, setSelectedStatus] = useState();
  const [errorMessages, setErrorMessages] = useState({});
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const { students, getRegisters, updateRegister, isLoading, error } =
    useInfo();
  const studentRef = useRef();
  const competencyRef = useRef();
  const statusRef = useRef();

  async function getStudentRegister(id) {
    await getRegisters(id).then((response) => {
      setStudentRegister(response);
    });
  }

  useEffect(() => {
    if (selectedStudent) {
      getStudentRegister(selectedStudent);
    }

    if (successMessage) {
      const timeoutId = setTimeout(() => {
        setSuccessMessage(false);
      }, 250);

      return () => clearTimeout(timeoutId);
    }
  }, [students, selectedStudent, studentRegister, successMessage]);

  async function handleSubmit() {
    const inputRefs = [studentRef, competencyRef, statusRef];

    let newErrorMessages = {};
    let hasErrors = false;

    for (let i = 0; i < inputRefs.length; i++) {
      const element = inputRefs[i]?.current;

      if (!element) continue;

      if (
        element.tagName.toLowerCase() === "select" &&
        element.selectedIndex === 0
      ) {
        newErrorMessages[element.name] = `${element.name} is required`;
        hasErrors = true;
      }
    }

    setErrorMessages(newErrorMessages);

    if (hasErrors) return;

    setIsLoadingUpdate(true);

    const updatedRegisters = await updateRegister(
      selectedStudent,
      selectedCompetency,
      selectedStatus
    ).then(() => {
      setIsLoadingUpdate(false);
      setSuccessMessage(true);
      studentRef.current.value = '';
      competencyRef.current.value = '';
      statusRef.current.value = '';
    });
  }

  if (isLoading) return <Spinner />;

  return (
    <main className="flex-1 bg-gray-100 place-items-center relative pb-4">
      <div className="mx-auto max-w-3xl h-[calc(100vh-100px)] mt-20">
        {successMessage && (
          <SuccessAlert setSuccessMessage={setSuccessMessage} />
        )}
        <div>
          <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  lg:text-sm">
            <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
              Student{" "}
            </label>
            <select
              id="selectedStudent"
              name="Student"
              ref={studentRef}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
            >
              <option value="" disabled selected>
                Select student
              </option>
              {students.map((el, e) => (
                <option key={e} value={el.id}>
                  {el.name}
                </option>
              ))}
            </select>
            <span className="text-red-500">{errorMessages["Student"]}</span>
          </div>

          <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  lg:text-sm">
            <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
              Competencies{" "}
            </label>
            <select
              id="selectedCompetency"
              name="Competency"
              ref={competencyRef}
              onChange={(e) => setSelectedCompetency(e.target.value)}
              className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
            >
              <option value="" disabled selected>
                Select competency
              </option>
              {studentRegister.length < 1 ? (
                <option value="" disabled>
                  Select student to see competencies
                </option>
              ) : (
                studentRegister &&
                studentRegister?.map((el, e) => (
                  <option key={e} value={el.competency_id}>
                    {el.competency_name}
                  </option>
                ))
              )}
            </select>
            <span className="text-red-500">{errorMessages["Competency"]}</span>
          </div>

          <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none  lg:text-sm">
            <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
              Status{" "}
            </label>
            <select
              id="selectedStatus"
              name="Status"
              ref={statusRef}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] "
            >
              <option value="" disabled selected>
                Select status
              </option>
              <option value="plan to meet">Plan to meet</option>
              <option value="not met">Not met</option>
              <option value="attempting to meet">Attempting to meet</option>
              <option value="competent">Competent</option>
              <option value="transfer">Transfer</option>
            </select>
            <span className="text-red-500">{errorMessages["Status"]}</span>
          </div>

          <div className="flex justify-center mt-10">
            <button
              className="bg-nextcolor w-24 h-12 text-white rounded-md"
              onClick={handleSubmit}
            >
              {isLoadingUpdate ? (
                <div
                  className="spinner inline-block w-2 h-2 ml-2 border-t-2 border-white border-solid rounded-full animate-spin"
                  style={{
                    borderColor: "#535787",
                    borderRightColor: "transparent",
                    width: "1.2rem",
                    height: "1.2rem",
                  }}
                ></div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
