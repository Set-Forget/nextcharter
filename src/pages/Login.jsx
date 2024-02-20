import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuthContext } from "../context/AuthProvider";
import { setToastState } from "../store/toastState";

const ERROR_MESSAGES = {
    PGRST116: "Sorry, your user is not allowed to access this application, please contact the administrator",
    "Invalid login credentials": "Sorry, your email or password is incorrect or your account does not exist",
    "Email not confirmed": "Please confirm your email before signing in, check your inbox",
};

export default function Login() {
    const { signInWithEmail } = useAuthContext();

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const error = await signInWithEmail(data.email, data.password);
            if (error) throw error;
            navigate("/");
        } catch (error) {
            return setToastState({
                open: true,
                title: ERROR_MESSAGES[error] || `Error signing in: ${error.message}`,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoToSignUp = () => {
        navigate("/signUp");
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
                            Sign in to your account
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
                                Sign in
                            </Button>
                            <Button type="button" onClick={handleGoToSignUp} variant="ghost">
                                Don't have an account? Sign up
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
