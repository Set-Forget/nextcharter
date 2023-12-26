import { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';

import Modal from "./Modal";
import ComboBoxSimple from "./ComboBoxSimple";
import Input from "./Input";
import useInfo from "../hooks/useInfo";

import { supabase } from "../lib/api";

export default function AddCourseModal({ isShowing, toggle }) {
  const [selectedInstitution, setSelectedInstitution] = useState(null)
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const { domains, institutions, getDomains } = useInfo()
  const inputRef = useRef()
  const inputRefCredits = useRef()

  async function handleSubmit() {
    setIsDisabled(true)
    const courseName = await inputRef.current.getValue()
    const credit_value = await inputRefCredits.current.getValue()

    const { data, error } = await supabase.from("course").insert({
      name: courseName,
      inst_domain_id: selectedDomain.inst_domain_id,
      credits: parseFloat(credit_value)
    }).select()
    
    if(!error) {
        toggle()
    }
  }

  function handleSetInstitution(e) {
    setSelectedDomain({ name: 'Select' })
    setSelectedInstitution(e)
    getDomains(e.id)
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
        setSelectedPerson={setSelectedDomain} />
      <br />
      <div className="flex">
        <Input flex="flex-auto w-60 mr-1" ref={inputRef} type="text" label="Course Name" />
        <Input flex="flex-auto w-3.5" ref={inputRefCredits} type="number" label="Credits" />
      </div>
      <br />
    </Modal>
  )
}

AddCourseModal.propTypes = {
  isShowing: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};
