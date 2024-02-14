import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";

import { supabase } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthProvider";

export default function SignUp() {
    const [error, setError] = useState();
    const [isLoadingSignUp, setIsLoadingSignUp] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const emailRef = useRef();
    const passwordRef = useRef();

    const { session } = useAuthContext();
    const navigate = useNavigate();

    async function signUp(e) {
        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {
            setIsLoadingSignUp(true);

            const { data, error: fetchError } = await supabase.from("allowed_users").select();
            // .eq("email", email);

            console.log("Data", data);

            if (fetchError) {
                setIsLoadingSignUp(false);
                const SUError = { message: "This email is not authorized to sign up." };
                throw SUError;
            }

            if (!data || data.length < 1) {
                setIsLoadingSignUp(false);
                const notFoundError = {
                    message: "This email is not authorized to sign up.",
                };
                // setError(notFoundError);
                throw notFoundError;
            } else {
                setError("");
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (signUpError) {
                    setIsLoadingSignUp(false);
                    throw signUpError;
                } else {
                    setIsLoadingSignUp(false);
                    setShowSuccessMessage(true);
                }
            }
        } catch (error) {
            setError(JSON.parse(JSON.stringify(error)));
        }
    }

    useEffect(() => {
        if (session) navigate("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    function login() {
        if (showSuccessMessage == true) {
            setShowSuccessMessage(false);
        }
        navigate("/login");
    }

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
                    </div>
                    {showSuccessMessage == false ? (
                        <>
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Sign Up
                            </h2>
                            <form className="space-y-6" onSubmit={signUp}>
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
                                    {isLoadingSignUp ? (
                                        <div className="flex w-full justify-center items-center rounded-md bg-nextcolor text-sm font-semibold leading-6 text-white h-9">
                                            <div
                                                className="spinner inline-block border-t-2 border-solid rounded-full animate-spin"
                                                style={{
                                                    borderColor: "white",
                                                    borderRightColor: "transparent", // Make this different from borderColor
                                                    width: "1rem",
                                                    height: "1rem",
                                                    marginTop: "2px",
                                                }}
                                            ></div>
                                        </div>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md bg-nextcolor px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Sign up
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={login}
                                        className="flex w-full justify-center rounded-md bg-transparent px-3 py-1.5 text-sm font-semibold leading-6 text-nextcolor border-1 border-nextcolor hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Already have an account? Log in
                                    </button>
                                </div>
                                {error && <p className="text-red-500 text-center">{error.message}</p>}
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Account created successfully.
                            </h2>
                            <button
                                type="button"
                                onClick={login}
                                className="flex w-full justify-center rounded-md bg-nextcolor px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Log in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
