import Table from "../components/Table"
import Spinner from "../components/Spinner"

import { useAxios } from "../hooks/useData"


export default function TableView() {
  const [{ data: students, loading: studentLoading, error: studentError }] = useAxios("/exec?action=uploadedList")
  
  console.log("Students: ", students)

  if (studentLoading) return <Spinner />

  return (
    <main className="flex-1 overflow-y-auto bg-gray-100 place-items-center pt-20 relative">
      <Table people={students.data} />
    </main>
  )
}