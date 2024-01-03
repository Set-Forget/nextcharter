import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import Modal from "./Modal";
import ComboBoxSimple from "./ComboBoxSimple";
import SelectWithCheck from "./SelectWithCheck";
import Input from "./Input";
import useInfo from "../hooks/useInfo";

import { supabase } from "../lib/api";

export default function AddCompetencyModal({ isShowing, toggle }) {
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { courses, domains, institutions, getDomains, getCourses } = useInfo();
  const inputRefCompName = useRef();
  // const inputRefCredits = useRef()

  async function handleSubmit() {
    setIsDisabled(true);
    const competencyList = await inputRefCompName.current.getValue();
    // const credit_value = await inputRefCredits.current.getValue()
    const compentenciesBody = competencyList
      .split(",")
      .map((competency) => ({ name: competency.trim() }));

    const { data, error } = await supabase
      .from("competency")
      .insert(compentenciesBody)
      .select();
    
    if (error) {
      setShowErrorMessage(true);
      setTimeout(() => {
        toggle();
        setShowErrorMessage(false);
      }, 5000);
    }

    const relations = data?.map((compentency) => ({
      course_id: selectedCourse.id,
      competency_id: compentency.id,
    }));

    if (!error) {
      const { data: finalData, error: nError } = await supabase
        .from("competency_course")
        .insert(relations)
        .select();

      if (!nError) {
        setShowSuccessIcon(true);
        setTimeout(() => {
          toggle();
          setShowSuccessIcon(false);
        }, 5000);
      }
    }
  }

  function handleSetInstitution(e) {
    setSelectedDomain({ name: "Select" });
    setSelectedInstitution(e);
    getDomains(e.id);
  }

  function handleSetDomain(e) {
    setSelectedCourse([]);
    setSelectedDomain(e);
    getCourses(e.inst_domain_id);
  }

  useEffect(() => {
    setSelectedInstitution(null);
    setSelectedDomain(null);
  }, []);

  return (
    <Modal
      title="Add Course"
      open={isShowing}
      setOpen={toggle}
      handleSubmit={handleSubmit}
      disabled={isDisabled}
      showSuccessIcon={showSuccessIcon}
      showErrorMessage={showErrorMessage}
    >
      <ComboBoxSimple
        label="Institution"
        // disabled={formData.selectedStudent}
        people={institutions}
        selectedPerson={selectedInstitution}
        setSelectedPerson={handleSetInstitution}
      />
      <br />
      <ComboBoxSimple
        label="Domains"
        // disabled={formData.selectedStudent}
        people={domains || []}
        selectedPerson={selectedDomain}
        setSelectedPerson={handleSetDomain}
      />
      <br />
      <SelectWithCheck
        label="Course"
        people={courses || []}
        selected={selectedCourse}
        setSelected={setSelectedCourse}
      />
      <br />
      <Input ref={inputRefCompName} type="text" label="Competency Name" />
      <br />
    </Modal>
  );
}

AddCompetencyModal.propTypes = {
  isShowing: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
