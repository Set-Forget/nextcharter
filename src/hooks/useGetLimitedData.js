import { useState } from "react";
import { supabase } from "../lib/api";
import { useEffect } from "react";

export default function useGetLimitedData(offset, limit, table) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getLimitedData = async () => {
        try {
            const { data } = await supabase
                .from(table)
                .select()
                .range(offset, limit)
                .eq("is_deleted", false);

            setData(data);
        } catch (error) {
            throw new Error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getLimitedData();
    }, []);

    return { data, isLoading };
}