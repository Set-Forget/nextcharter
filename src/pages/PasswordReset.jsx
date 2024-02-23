import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { supabase } from "../lib/api";
import { setToastState } from "../store/toastState";

const SUPABASE_URL = import.meta.env.VITE_APP_SUPABASE_URL;

export default function PasswordReset() {
    const navigate = useNavigate();

    const location = useLocation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const getUrlParams = () => {
        const url = location.hash;
        const urlParams = new URLSearchParams(url);
        const urlParamsObj = Object.fromEntries(urlParams);
        return {
            ...urlParamsObj,
            access_token: urlParamsObj["#access_token"],
        };
    };

    const getProjectId = () => {
        const parsedUrl = new URL(SUPABASE_URL);
        const hostname = parsedUrl.hostname;
        const substr = hostname.split(".")[0];
        return substr;
    };

    const loginUser = () => {
        const { access_token, expires_at, expires_in, refresh_token, token_type } = getUrlParams();
        const projectId = getProjectId();

        localStorage.setItem(
            `sb-${projectId}-auth-token`,
            JSON.stringify({
                access_token,
                expires_at,
                expires_in,
                refresh_token,
                token_type,
            })
        );
    };

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            return setToastState({
                open: true,
                title: "Passwords do not match",
                type: "error",
            });
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: data.password,
            });
            if (error) throw error;
            setToastState({
                open: true,
                title: "Password reset successful",
                type: "success",
            });
            navigate("/login");
        } catch (error) {
            setToastState({
                open: true,
                title: `Error resetting password: ${error.message}`,
                type: "error",
            });
        }
    };

    useEffect(() => {
        loginUser();
    }, []);

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
                            Reset your password
                        </h2>
                    </div>
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="gap-2 flex flex-col">
                            <Input
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                register={register("password", { required: true })}
                                placeholder="Password"
                                errors={errors.password && "Password is required"}
                            />
                            <Input
                                name="confirmPassword"
                                type="password"
                                autoComplete="current-password"
                                register={register("confirmPassword", { required: true })}
                                placeholder="Confirm Password"
                                errors={errors.confirmPassword && "Password is required"}
                            />
                        </div>
                        <div className="flex justify-center flex-col gap-2">
                            <Button type="submit">Reset Password</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
