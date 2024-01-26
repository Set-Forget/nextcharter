import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../lib/api";

export default function useGetFilterData(table, filter, filterValue) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const getFilteredData = async () => {
        try {
            if (filterValue === undefined || filterValue.length === 0) return;

            if (Array.isArray(filterValue)) {
                console.log("filterValue", filterValue);
                const { data } = await supabase.from(table).select().in(filter, filterValue);
                return setData(data);
            }

            const { data } = await supabase.from(table).select().eq(filter, filterValue);
            setData(data);
        } catch (error) {
            throw new Error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getFilteredData();
    }, [isLoading]);

    return { isLoading, data };
}
