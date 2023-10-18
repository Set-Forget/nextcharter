import axios from "axios"
import { makeUseAxios } from "axios-hooks"

import { host } from "../constants"

export const useAxios = makeUseAxios({
  axios: axios.create({ baseURL: host })
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