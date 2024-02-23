import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/api";

const Context = createContext();

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signInWithEmail = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) return error.message;

        const res = await getSession();
        return res;
    };

    const getUser = async (email) => {
        const { data: userData, error: userDataError } = await supabase
            .from("allowed_users")
            .select()
            .eq("email", email)
            .single();
        const { data: studentData, error: studentDataError } = await supabase
            .from("student")
            .select()
            .eq("email", email)
            .single();
        if (userDataError || studentDataError) return userDataError || studentDataError;
        setUser({ ...userData, ...studentData });
    };

    const getSession = async () => {
        setLoading(true);

        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (session?.user?.email) {
            const error = await getUser(session.user.email);
            setLoading(false);
            if (error) return error.code;
        }

        setLoading(false);
    };

    useEffect(() => {
        getSession();
    }, []);

    return (
        <Context.Provider
            value={{
                user,
                loading,
                signInWithEmail,
            }}
        >
            {children}
        </Context.Provider>
    );
}

export const useAuthContext = () => useContext(Context);
