import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { supabase } from "../lib/api";
import { setToastState } from "../store/toastState";

export default function SignUp() {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const userIsAllowed = async (email) => {
        const { data } = await supabase.from("allowed_users").select().eq("email", email).single();
        return data !== null;
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const isUserAllowed = await userIsAllowed(data.email);

            if (!isUserAllowed)
                throw new Error(
                    "This user is not allowed to access this application, please contact the administrator"
                );

            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });

            if (error) throw error;

            navigate("/login");

            setToastState({
                open: true,
                title: "Please check your email to confirm your account",
                type: "success",
            });
        } catch (error) {
            return setToastState({
                open: true,
                title: `Error signing up: ${error.message}`,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm flex flex-col gap-6">
                    <div>
                        <img
                            className="mx-auto h-16 w-auto bg-nextcolor p-2 rounded"
                            src="https://nextcharterschool.org/wp-content/uploads/2020/08/logo.png"
                            alt="Next Charter School"
                        />
                        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Sign up for an account
                        </h2>
                    </div>
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="gap-2 flex flex-col">
                            <Input
                                name="email"
                                type="email"
                                autoComplete="email"
                                register={register("email", { required: true })}
                                placeholder="Email address"
                                errors={errors.email && "Email is required"}
                            />
                            <Input
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                register={register("password", { required: true })}
                                placeholder="Password"
                                errors={errors.password && "Password is required"}
                            />
                        </div>
                        <div className="flex justify-center flex-col gap-2">
                            <Button type="submit" isLoading={loading}>
                                Sign up
                            </Button>
                            <Button type="button" onClick={handleGoToLogin} variant="ghost">
                                Already have an account? Sign in
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
