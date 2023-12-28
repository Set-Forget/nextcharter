import { useState, useEffect } from "react";
import useInfo from "../hooks/useInfo";

const ProgressBar = ({ selectedStudent, competencyByStudent }) => {
  let oldestDate = null;

  competencyByStudent.forEach(item => {
    const currentDate = new Date(item.created_at);
  
    if (oldestDate === null || currentDate < oldestDate) {
      oldestDate = currentDate;
    }
  });
  
  // Extract the year and add 4
  const defaultTargetYear = oldestDate ? oldestDate.getFullYear() + 4 : null;
  
  const [percentProgress, setPercentProgress] = useState(0);
  const [targetYear, setTargetYear] = useState(defaultTargetYear);

  useEffect(() => {
    const fetchData = async () => {
      const competentCredits = competencyByStudent.reduce(
        (sum, competency) =>
          competency.status === "competent"
            ? sum + competency.competency_course.credit_value
            : sum,
        0
      );

      const currentYear = new Date().getFullYear();
      const yearsUntilTarget = Math.max(targetYear - currentYear, 0); // Ensure it's not negative

      // Adjusted percentage calculation
      const percentage =
        yearsUntilTarget === 0
          ? (competentCredits / 20) * 100
          : (competentCredits / (20 / (yearsUntilTarget + 1))) * 100;
      setPercentProgress(Math.min(percentage, 100)); // Cap at 100%
    };

    fetchData();
  }, [selectedStudent, competencyByStudent, targetYear]);

  const handleSumYear = () => {
    setTargetYear(targetYear + 1);
  };

  const handleRestYear = () => {
    setTargetYear(targetYear - 1);
  };

  return (
    <div className="ml-auto w-[30rem] mt-6 flex flex-col items-center gap-4">
      <div className="w-[30rem] flex justify-between -mb-3">
        <p>Target % based on selected year</p>
        <div className="flex flex-row">
          <button
            onClick={handleRestYear}
            disabled={targetYear <= new Date().getFullYear()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#6366F1"
              className="w-4 h-4 mr-2 mt-[1px]"
            >
              <path
                fillRule="evenodd"
                d="M4.72 9.47a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L6.31 10l3.72-3.72a.75.75 0 1 0-1.06-1.06L4.72 9.47Zm9.25-4.25L9.72 9.47a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L11.31 10l3.72-3.72a.75.75 0 0 0-1.06-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <p>{targetYear}</p>
          <button onClick={handleSumYear}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#6366F1"
              className="w-4 h-4 ml-2 mt-[1px]"
            >
              <path
                fillRule="evenodd"
                d="M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="shadow-md bg-grey-light w-[30rem] border-blue-400 border-[0.5px] rounded">
        <div
          className="bg-blue-400 text-xs leading-none py-[0.35rem] text-center text-white"
          style={{ width: `${percentProgress}%` }}
        >
          {percentProgress.toFixed(2)}%{" "}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
