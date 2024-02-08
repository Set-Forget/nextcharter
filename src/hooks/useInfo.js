import { supabase } from "../lib/api";

export default function useInfo() {
    async function insertToDatabase(data, table) {
        const { data: insertedData, error } = await supabase.from(table).insert(data).select();
        if (error) throw new Error(error.message);
        return insertedData;
    }

    async function deleteFromDatabase(field, fieldVal, table) {
        const { data: deletedData, error } = await supabase.from(table).delete().eq(field, fieldVal).select();
        if (error) throw new Error(error.message);
        return deletedData;
    }

    async function updateDatabase(fieldId, data, table) {
        const { data: updatedData, error } = await supabase
            .from(table)
            .update(data)
            .eq("id", fieldId)
            .select();
        if (error) throw new Error(error.message);
        return updatedData;
    }

    async function updateCompetencyStatus(student_id, competency_id, newStatus) {
        const { data, error } = await supabase
            .from("registers")
            .update({ status: newStatus })
            .eq("student_id", student_id)
            .in("competency_id", competency_id);
        if (error) throw new Error(error.message);
        return data;
    }

    async function getFromDatabase(field, fieldVal, table) {
        const { data: fetchedData, error } = await supabase
            .from(table)
            .select()
            .eq(field, fieldVal)
            .eq("is_deleted", false);
        if (error) throw new Error(error.message);
        return fetchedData;
    }

    async function getLimitedFromDatabase(limit, offset, table) {
        const { data: fetchedData, error } = await supabase
            .from(table)
            .select()
            .range(offset, limit)
            .eq("is_deleted", false);
        if (error) throw new Error(error.message);
        return fetchedData;
    }

    return {
        updateCompetencyStatus,
        getFromDatabase,
        deleteFromDatabase,
        updateDatabase,
        insertToDatabase,
        getLimitedFromDatabase,
    };
}
