import StudentCard from "../components/StudentCard"
import Spinner from "../components/Spinner"

import useInfo from "../hooks/useInfo"

export default function Profile() {
  const { students, isLoading } = useInfo()

  if (isLoading) return <Spinner />

  return(
    <main className="flex-1 bg-gray-100 place-items-center relative pb-4">
      <div className="mx-auto max-w-3xl overflow-scroll h-[calc(100vh-100px)] mt-20">
        <StudentCard people={students} />
      </div>
    </main>
  )
}