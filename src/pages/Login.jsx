import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";

import { supabase } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthProvider";
import Spinner from "../components/Spinner";

export default function Login() {
  const [error, setError] = useState();
  const [storedUserRole, setStoredUserRole] = useState(null);
  const emailRef = useRef();
  const passwordRef = useRef();

  const { session, loading } = useAuthContext();

  const navigate = useNavigate();

  async function signInWithEmail(e) {
    e.preventDefault();

    let email = emailRef.current.value;

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: passwordRef.current.value,
    });

    if (error) {
      setError(JSON.parse(JSON.stringify(error)));
    }

    const { data, error: fetchError } = await supabase
      .from("allowed_users")
      .select()
      .eq("email", email);

    if (data.length >= 1) {
      localStorage.setItem("userRole", data[0].role);
      setStoredUserRole(data[0].role);
    }
  }

  let userRoleInStorage = localStorage.getItem('userRole');

  const fetchData = async () => {
    if (session && (storedUserRole != null || userRoleInStorage != null)) {
      if (storedUserRole === "student") {
        try {
          const { data, error: fetchError } = await supabase
            .from("student")
            .select()
            .eq("email", emailRef.current.value);

          if (fetchError) {
            console.error("Error fetching student data:", fetchError);
            return;
          }

          if (data && data.length > 0) {
            localStorage.setItem("studentCode", data[0].code);
            navigate("/profile/" + data[0].code);
          } else {
            console.error("No student data found");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else if (storedUserRole === "teacher") {
        navigate("/profile");
      } else {
        navigate("/#");
      }
    }
  };

  useEffect(() => {
    if (window.location.hash === '#/login') {
        fetchData();
    }
}, [session, storedUserRole]);

  function signUp() {
    navigate("/signUp");
  }

  if (session == null && userRoleInStorage !== null) return <Spinner />

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
              <button
                type="button"
                onClick={signUp}
                className="flex w-full justify-center rounded-md bg-transparent px-3 py-1.5 text-sm font-semibold leading-6 text-nextcolor border-1 border-nextcolor hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Dont have an account? Register
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-center">{error.message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
