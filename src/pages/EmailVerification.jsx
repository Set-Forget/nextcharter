import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { supabase } from "../lib/api";

export default function EmailVerification() {
    const [searchParams] = useSearchParams();

    const { redirect_to, token_hash, type } = Object.fromEntries(searchParams);

    const verifyEmail = async () => {
        try {
            await supabase.auth.verifyOtp({ token_hash, type });
        } catch (error) {
            setError(error.message);
        } finally {
            setTimeout(() => {
                window.location.href = redirect_to;
            }, 5000);
        }
    };

    useEffect(() => {
        verifyEmail();
    }, []);

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

                        <div>
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Your email has been verified successfully
                            </h2>

                            <p className="mt-2 text-center text-sm text-gray-600">
                                You will be redirected in 5 seconds
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
