import { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';

import Modal from "./Modal";
import ComboBoxSimple from "./ComboBoxSimple";
import SelectWithCheck from "./SelectWithCheck";
import Input from "./Input";
import useInfo from "../hooks/useInfo";

import { supabase } from "../lib/api";

export default function AddCompetencyModal({ isShowing, toggle }) {
  const [selectedInstitution, setSelectedInstitution] = useState(null)
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState([])
  const [isDisabled, setIsDisabled] = useState(false)
  const { courses, domains, institutions, getDomains, getCourses } = useInfo()
  const inputRefCompName = useRef()
  const inputRefCredits = useRef()

  async function handleSubmit() {
    setIsDisabled(true)
    const competencyName = await inputRefCompName.current.getValue()
    const credit_value = await inputRefCredits.current.getValue()
    
    const { data, error } = await supabase.from("competency").insert({
      name: competencyName,
    }).select()
    if(!error) {
      const { data: finalData, error: nError } = await supabase.from("competency_course").insert({
        course_id: selectedCourse.id,
        competency_id: data[0].id,
        credit_value
      }).select()
      if (!nError)
        toggle()
    }
  }

  function handleSetInstitution(e) {
    setSelectedDomain({ name: 'Select' })
    setSelectedInstitution(e)
    getDomains(e.id)
  }

  function handleSetDomain(e) {
    setSelectedCourse([])
    setSelectedDomain(e)
    getCourses(e.inst_domain_id)
  }

  useEffect(() => {
    setSelectedInstitution(null)
    setSelectedDomain(null)
  }, [])
  
  return(
    <Modal 
      title="Add Course" 
      open={isShowing} 
      setOpen={toggle} 
      handleSubmit={handleSubmit}
      disabled={isDisabled}
    >
      <ComboBoxSimple
        label="Institution"
        // disabled={formData.selectedStudent}
        people={institutions}
        selectedPerson={selectedInstitution}
        setSelectedPerson={handleSetInstitution} />
      <br />
      <ComboBoxSimple
        label="Domains"
        // disabled={formData.selectedStudent}
        people={domains || []}
        selectedPerson={selectedDomain}
        setSelectedPerson={handleSetDomain} />
      <br />
      <SelectWithCheck
        label="Course"
        people={courses || []}
        selected={selectedCourse}
        setSelected={setSelectedCourse} />
      <br />
      <div className="flex">
        <Input flex="flex-auto w-60 mr-1" ref={inputRefCompName} type="text" label="Competency Name" />
        <Input flex="flex-auto w-3.5" ref={inputRefCredits} type="number" label="Credits" />
      </div>
      <br />
    </Modal>
  )
}

AddCompetencyModal.propTypes = {
  isShowing: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};
