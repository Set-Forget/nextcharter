import axios from "axios"
import { makeUseAxios } from "axios-hooks"

const useAxios = makeUseAxios({
  axios: axios.create({ baseURL: 'https://script.google.com/macros/s/AKfycbxwb3WLIgdG5bnG457NBtttUq89PMC9Q85umX3EeStfd3jTFLn8uClvPdTI3hAfXU7K' })
})

export default function useData() {
  const [{ data: students, loading: studentLoading, error: studentError }] = useAxios("/exec?action=student")
  const [{ data: domains, loading: domainLoading, error: domainError }] = useAxios("/exec?action=domain")
  const [{ data: courses, loading: courseLoading, error: courseError }] = useAxios("/exec?action=course")
  const [{ data: competencies, loading: competencyLoading, error: competencyError }] = useAxios("/exec?action=competency")

  return [{
      students,
      domains,
      courses,
      competencies,
      loading: !!(studentLoading || domainLoading || courseLoading || competencyLoading),
      error: !!(studentError || domainError || courseError || competencyError)
  }]
}