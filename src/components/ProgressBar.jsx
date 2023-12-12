import { useState, useEffect } from 'react';

const ProgressBar = ({ selectedStudent, competencyByStudent }) => {
  const [percentProgress, setPercentProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Calculate the sum of credit values with status "competent"
      const competentCredits = competencyByStudent.reduce(
        (sum, competency) =>
          competency.status === 'competent' ? sum + competency.competency_course.credit_value : sum,
        0
      );

      console.log(competentCredits)

      // Calculate the percentage of completion towards the 20 required credits
      const requiredCredits = 20;
      const percentage = (competentCredits / requiredCredits) * 100;

      // Set the state to trigger a re-render with the updated percentage
      setPercentProgress(percentage);
    };

    fetchData();
  }, [selectedStudent, competencyByStudent]);

  return (
    <div className="ml-auto mt-2">
      <p>Target % based on today's date</p>
      <div className="shadow-md bg-grey-light w-[30rem] border-blue-400 border-[0.5px] rounded">
        <div className="bg-blue-400 text-xs leading-none py-[0.35rem] text-center text-white" style={{ width: `${percentProgress}%` }}>
          {percentProgress}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
