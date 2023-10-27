import { useState } from "react";

import ComboBoxSimple from "../components/ComboBoxSimple";
import Spinner from "../components/Spinner";

import useData, { useAxios } from "../hooks/useData"

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
              competencies: []
          };
      }
      
      acc[key].competencies.push({
          competency_name: item.competency_name,
          competency_id: item.competency_id,
          status: item.status
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
}

const colorPallete = {
  blank: {
    bg: 'bg-slate-200',
  },
  "plan to meet": {
    bg: 'bg-blue-500',
    text: 'text-white',
    tp: 'text-blue-500'
  }, 
  "not meet": {
    bg: 'bg-slate-500',
    text: 'text-white',
    tp: 'text-slate-500',
  },
  "attempting to meet": {
    bg: 'bg-amber-400',
    text: 'text-grey-500',
    tp: 'text-amber-400'
  },
  "competent": {
    bg: 'bg-green-500',
    text: 'text-white',
    tp: 'text-green-500'
  },
  "transfer": {
    bg: 'bg-green-500',
    text: 'text-white',
    tp: 'text-green-500'
  }
}

export default function StudentProgress() {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [params, setParams] = useState({ studentId: null })

  const [{ students, loading, error }] = useData()
  const [{ data: competencyBystudent, loading: studentLoading, error: studentError }, refetch] = useAxios({
    url: "/exec?action=studentByCompetency",
    params: { ...params }
  },
  { manual: true }
  )

  function handleSelectStudent(e) {
    setParams({
      studentId: e.id
    })
    setSelectedStudent(e)
  }

  function handleFetch() {
    refetch()
  }

  if (studentLoading || loading) return <Spinner />

  const groupedByDomainAndCourse = competencyBystudent && Object.values(groupByDomainAndCourse(competencyBystudent.data));
  const groupedByDomainName = competencyBystudent && groupByDomainName(groupedByDomainAndCourse)
  const domainNameList = competencyBystudent && Object.keys(groupedByDomainName)
  
  return(
    <main className="flex-1 overflow-y-auto bg-slate-50 place-items-center pt-20 pr-4 pl-4">
      <div className="w-[320px] mb-8 mt-8 flex items-end">
        <ComboBoxSimple
          label="STUDENT"
          // disabled={formData.selectedStudent}
          people={students.data}
          selectedPerson={selectedStudent}
          setSelectedPerson={handleSelectStudent}
        />
        <button
          type="button"
          disabled={!params.studentId}
          onClick={handleFetch}
          className="disabled:opacity-50 h-9 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
        >
          search
        </button>
      </div>
      {competencyBystudent && domainNameList.map(key => {
        return (
          <div key={key} className="shadow-md p-2 mb-8 rounded-l bg-white border-indigo-300 border-[0.5px] border-opacity-70">
            <h2 className="mb-6 text-center text-indigo-500 font-semibold uppercase rounded w-[calc(6rem*3)] -mt-5 mx-auto bg-white border-indigo-300 border-[0.5px] border-opacity-70">{key}</h2>
            { groupedByDomainName[key].map(courseItem => {
                const courseName = courseItem.course_name
                const { competencies } = courseItem
                const noCompetents = competencies.filter(i => i.status !== 'competent' && i.status !== 'transfer')
                const competents = competencies.filter(i => i.status == 'competent' || i.status == 'transfer')
                const completed = competents.length

                while (noCompetents.length < 8) {
                  noCompetents.unshift({ compentecy_name: '', status: 'blank' })
                }
                while (competents.length < 8) {
                  competents.push({ compentecy_name: '', status: 'blank' })
                }

                return(
                  <div key={courseName} className="flex gap-2 justify-center mb-4">
                    {noCompetents.map(ptm =>
                      <div className="relative inline-block tooltip" key={ptm.id}>
                        <div className={`w-[4.6rem] h-16 ${colorPallete[ptm.status].bg} ${colorPallete[ptm.status].text} flex justify-center items-center rounded-md`}>
                          {ptm.competency_name}
                        </div>
                        {ptm.status !== 'blank' && (
                          <div className={`flex ${colorPallete[ptm.status].bg} ${colorPallete[ptm.status].text} flex-col p-2 w-52 rounded-lg z-20 absolute right-0 invisible tooltip-item mt-2`}>
                            <p className="text-sm capitalize"><span className="font-semibold">Status</span>: {ptm.status}</p>
                            <p className="text-sm capitalize"><span className="font-semibold">Belongs to</span>: {courseName}</p>
                            <p className="text-sm capitalize">{`(${completed}/${competencies.length})`}</p>
                            <svg className={`absolute ${colorPallete[ptm.status].tp} -top-3 h-8 right-0 mr-3`} x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
                              <polygon className="fill-current" points="50,0 100,100 0,100"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="w-[6rem] rounded-sm h-16 bg-slate-600 text-white flex justify-center items-center text-center">{courseName}</div>
                    {competents.map(ptm =>
                      <div className="relative inline-block tooltip" key={ptm.id}>
                        <div className={`w-[4.6rem] h-16 ${colorPallete[ptm.status].bg} ${colorPallete[ptm.status].text} flex justify-center items-center rounded-md`}>
                          {ptm.competency_name}
                        </div>
                        {ptm.status !== 'blank' && (
                          <div className={`flex ${colorPallete[ptm.status].bg} ${colorPallete[ptm.status].text} flex-col p-2 w-56 rounded-lg z-20 absolute right-0 invisible tooltip-item mt-2`}>
                            <p className="text-sm capitalize"><span className="font-semibold">Status</span>: {ptm.status}</p>
                            <p className="text-sm capitalize"><span className="font-semibold">Belongs to</span>: {courseName}</p>
                            <p className="text-sm capitalize">{`(${completed}/${competencies.length})`}</p>
                            <svg className={`absolute ${colorPallete[ptm.status].tp} -top-3 h-8 right-0 mr-3`} x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
                              <polygon className="fill-current" points="50,0 100,100 0,100"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            }
          </div>
        )
      })
      }
    </main>
  )
}