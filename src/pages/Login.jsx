import { useEffect, useRef, useState } from "react"
import Header from "../components/Header"

import { supabase } from "../lib/api"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../context/AuthProvider"

export default function Login() {
  const [error, setError] = useState()
  const emailRef =  useRef()
  const passwordRef =  useRef()

  const { session } = useAuthContext()
  const navigate = useNavigate()

  async function signInWithEmail(e) {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email: emailRef.current.value,
      password: passwordRef.current.value
    })

    if (error) {
      setError(JSON.parse(JSON.stringify(error)))
    }
  }

  useEffect(() => {
    if (session)
      navigate("/")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return (
    <div className="flex flex-col h-screen">
      <Header navItems={[]} />
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-10">
          <div>
            <img
              className="mx-auto h-16 w-auto bg-nextcolor p-2 rounded"
              src="https://nextcharterschool.org/wp-content/uploads/2020/08/logo.png"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="space-y-6" onSubmit={signInWithEmail}>
            <div className="relative -space-y-px rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  ref={emailRef}
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                />
              </div>
              <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                ref={passwordRef}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-nextcolor px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
            {error && <p className="text-red-500 text-center">{error.message}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}