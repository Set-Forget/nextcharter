import { useState } from 'react'
import axios from 'axios'

// COMPONENTS
import SelectWithCheck from './components/SelectWithCheck'
import Fieldset from './components/Fieldset'
import ComboBoxSimple from './components/ComboBoxSimple'
import ResumeItem from './components/ResumeItem'
import Spinner from './components/Spinner'

// HOOKS
import useData from './hooks/useData'

import { host } from './constants'

function sumCreditValues(data) {
  return data.reduce((total, currentArray) => {
    return total + currentArray.reduce((subTotal, item) => {
      return subTotal + item.credit_value;
    }, 0);
  }, 0);
}

export default function App() {
  const [postLoading, setPostLoading] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedDomain, setSelectedDomain] = useState({ name: 'Select' })
  const [selectedCourse, setSelectedCourse] = useState([])
  const [formData, setFormData] = useState({
    selectedStudent: null,
    list: []
  })

  const [{ students, domains, courses, competencies, loading, error }] = useData()
  
  const handleAdd = () => {
    setFormData(prevState => {
      if (prevState.selectedStudent) {
        return ({
          ...prevState,
          list: [
            ...prevState.list,
            {
              selectedDomain,
              selectedCourse,
              competencies: compentenciesArrayFiltered
            }
          ]
        })
      } else {
        return ({
          ...prevState,
          selectedStudent,
          list: [
            ...prevState.list,
            {
              selectedDomain,
              selectedCourse,
              competencies: compentenciesArrayFiltered
            }
          ]
        })
      }
    })
  }
  
  function deleteDomainFromList(index) {
    setFormData((prevState) => ({
      ...prevState,
      selectedStudent: prevState.list.length === 1 ? null : prevState.selectedStudent,
      list: [...prevState.list.slice(0, index), ...prevState.list.slice(index + 1)]
    }))
  }

  function handleSetDomain(e) {
    setSelectedCourse([])
    setSelectedDomain(e)
  }

  function handleSetStudent(e) {
    setSelectedDomain({ name: 'Select' })
    setSelectedCourse([])
    setSelectedStudent(e)
  }

  function clearForm() {
    setSelectedStudent(null)
    setSelectedDomain({ name: 'Select' })
    setSelectedCourse([])
    setFormData({
      selectedStudent: null,
      list: []
    })
  }

  const handleSubmit = () => {
    setPostLoading(true)
    axios.post(host + "/exec?action=registrations", JSON.stringify(formData))
      .then(({ data }) => {
        if (data.result === 'success') {
          clearForm()
          setPostLoading(false)
        }
      })
  }

  if (loading || postLoading) return <Spinner />
  if (error) return <p>Error!</p>

  const coursesFiltered = selectedDomain?.name !== "Select" ? courses.data.filter(i => i.domain_id === selectedDomain.id) : courses.data

  const compentenciesArrayFiltered =  selectedCourse.map((item) => {
    const competenciesFiltered = competencies.data.filter(i => i.course_id == item.id)
    return competenciesFiltered
  })

  return (
    <main className="flex-1 overflow-y-auto bg-gray-100 place-items-center p-4 relative">
      <div className='bg-white h-[calc(100vh-100px)] max-w-7xl mt-20 m-auto rounded-lg shadow flex'>
        <div className="flex flex-col flex-1 p-8">
          <form className='mb-8'>
              <ComboBoxSimple
                label="Student"
                disabled={formData.selectedStudent}
                people={students.data}
                selectedPerson={selectedStudent}
                setSelectedPerson={handleSetStudent} />
              <br />
              <SelectWithCheck
                label="Domains"
                people={domains.data}
                selected={selectedDomain}
                setSelected={handleSetDomain} />
              <br />
              <SelectWithCheck
                label="Course"
                people={coursesFiltered}
                selected={selectedCourse}
                setSelected={setSelectedCourse}
                multiple />
              <br />
              <label className='block text-sm font-medium leading-6 text-gray-900 mb-4'>Compentencies</label>
              {compentenciesArrayFiltered.map((filters, index) => (
                <Fieldset key={index}
                  items={filters}
                  label="Competencies" />
              ))
              }
          </form>
          {selectedDomain.name !== "Select" && (
            <>
              <p className='block text-sm font-medium leading-6 text-gray-600'>{selectedDomain.name} credits required: {selectedDomain.credit_required}</p>
              <p className='block text-sm font-medium leading-6 text-gray-900'>{selectedDomain.name} credits attached: {sumCreditValues(compentenciesArrayFiltered)}</p>
            </>
          )}
          <br />
          <div className='flex justify-end'>
            <button
              disabled={selectedDomain.name === "Select" || sumCreditValues(compentenciesArrayFiltered) < selectedDomain.credit_required}
              type="button"
              onClick={handleAdd}
              className="rounded-full bg-indigo-600 p-2 disabled:opacity-50 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
            </button>
          </div>
        </div>
        <div className='flex flex-col flex-1 p-4 bg-gray-100 shadow h-full rounded'>
          <div className='flex-1'>
            <ul role="list" className="mt-3 grid grid-cols-1 gap-3">
              {formData.selectedStudent && formData.list.map((obj, i) => (
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
          <button
            type="button"
            disabled={!formData.selectedStudent}
            onClick={handleSubmit}
            className="disabled:opacity-50 h-12 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {"Submit"}
          </button>
        </div>
      </div>
    </main>
  )
}
