import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../lib/api";

export default function useGetDataById(table, id) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const getDataById = async () => {
        try {
            if (id === undefined || id.length === 0) return;

            if (Array.isArray(id)) {
                const { data } = await supabase.from(table).select().in("id", id);
                return setData(data);
            }

            const { data } = await supabase.from(table).select().eq("id", id);
            setData(data);
        } catch (error) {
            throw new Error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getDataById();
    }, []);

    return { isLoading, data };
}
