import { useRef, useState } from "react";
import PropTypes from 'prop-types';

import Modal from "./Modal";
import ComboBoxSimple from "./ComboBoxSimple";
import Input from "./Input";
import useInfo from "../hooks/useInfo";

import { supabase } from "../lib/api";

export default function AddDomainModal({ isShowing, toggle }) {
  const [selectedInstitution, setSelectedInstitution] = useState()
  const [isDisabled, setIsDisabled] = useState(false)
  const { institutions } = useInfo()
  const inputRef = useRef()

  async function handleSubmit() {
    setIsDisabled(true)
    const domainName = await inputRef.current.getValue()
    const { data, error } = await supabase.from("domain").insert({ name: domainName }).select()
    if(!error) {
      const { error: oError } = await supabase.from("institution_domain").insert({
        institution_id: selectedInstitution.id,
        domain_id: data[0].id
      }).select()
      if(!oError)
        toggle()
    }
  }
  
  return(
    <Modal 
      title="Add Domain" 
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
        setSelectedPerson={setSelectedInstitution} />
      <br />
      <Input ref={inputRef} type="text" label="Domain Name" />
      <br />
    </Modal>
  )
}

AddDomainModal.propTypes = {
  isShowing: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};
