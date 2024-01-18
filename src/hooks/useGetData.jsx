import { useState } from "react";
import { supabase } from "../lib/api";
import { useEffect } from "react";

export default function useGetData(table) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const getAllData = async () => {
        try {
            const { data } = await supabase.from(table).select();
            console.log(data);
            setData(data);
        } catch (error) {
            throw new Error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllData();
    }, []);

    return { isLoading, data };
}
