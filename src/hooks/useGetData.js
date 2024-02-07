import { useState } from "react";
import { supabase } from "../lib/api";
import { useEffect } from "react";

export default function useGetData(table, realtime) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    let subscription;

    const getAllData = async () => {
        try {
            const { data } = await supabase.from(table).select()
            setData(data);
        } catch (error) {
            throw new Error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (realtime) {
        subscription = supabase
            .channel(table)
            .on(
                'postgres_changes',
                {
                    event: "*",
                    schema: 'public',
                    table: table,
                },
                () => getAllData()


            )
            .subscribe();
    }

    useEffect(() => {
        getAllData();

        return () => {
            if (subscription) supabase.removeChannel(subscription);
        };

    }, []);

    return { isLoading, data };
}
