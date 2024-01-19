import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/api";

export default function useInfo() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setIsError] = useState();

    const [students, setStudents] = useState();
    const [institutions, setInstitutions] = useState();
    const [domains, setDomains] = useState();
    const [courses, setCourses] = useState();
    const [competencies, setCompetencies] = useState([]);

    async function getStudents(flag) {
        const { data, error: studentError } = await supabase.from("student").select();
        const students = data.map((item) => {
            const lastname = item.lastname;
            delete item.lastname;
            return { ...item, name: `${item.name} ${lastname}` };
        });

        if (studentError) return setIsError(studentError);

        if (flag) return students;
        else setStudents(students);
    }

    async function getInstitutions(flag) {
        const { data: institutions, error } = await supabase.from("institution").select();

        if (error) return setIsError(error);

        if (flag) return institutions;
        else setInstitutions(institutions);
    }

    async function getDomains(institution_id = "d00697b7-20ab-4cb4-a4bf-a1da9fe179bf") {
        const { data, error: domainError } = await supabase
            .from("institution_domain")
            .select(`id, domain(id,name)`)
            .eq("institution_id", institution_id);

        if (domainError) {
            setIsError(domainError);
            return;
        }

        const domains = data.map((item) => ({
            ...item.domain,
            inst_domain_id: item.id,
        }));
        setDomains(domains);
    }

    async function getCourses(inst_domain_id) {
        const { data: courses, error } = await supabase
            .from("course")
            .select()
            .eq("inst_domain_id", inst_domain_id);

        if (error) setIsError(error);
        else setCourses(courses);
    }

    const getCompetencies = useCallback(async function (course_id) {
        const { data, error } = await supabase
            .from("competency_course")
            .select(`*, competency(name)`)
            .in("course_id", course_id);

        if (error) setIsError(error);
        else {
            const competencies = data.map(({ competency, ...rest }) => ({
                ...rest,
                name: competency.name,
            }));
            setCompetencies(competencies);
        }
    }, []);

    async function getRegisters(student_id) {
        const { data, error } = await supabase
            .from("registers")
            .select(`*, competency_course(credit_value)`)
            .eq("student_id", student_id)
            .eq("is_deleted", false);
        if (error) throw error;
        return data;
    }

    //--

    async function insertToDatabase(data, table) {
        const { data: insertedData, error } = await supabase.from(table).insert(data).select();
        if (error) throw new Error(error.message);
        return insertedData;
    }

    async function updateCompetencyStatus(student_id, competency_id, newStatus) {
        const { data, error } = await supabase
            .from("registers")
            .update({ status: newStatus })
            .eq("student_id", student_id)
            .in("competency_id", competency_id);
        if (error) throw error;

        return data;
    }

    //--

    async function updateRegister(student_id, competency_id, newStatus) {
        const { data, error } = await supabase
            .from("registers")
            .update({ status: newStatus })
            .eq("student_id", student_id)
            .eq("competency_id", competency_id);
        if (error) {
            throw error;
        }
        console.log(data);
        return data;
    }
    async function updateMultipleRegisters(student_id, competency_ids, newStatus) {
        try {
            const { data, error } = await supabase
                .from("registers")
                .update({ status: newStatus })
                .eq("student_id", student_id)
                .in("competency_id", competency_ids); // 'in' filter for array of ids

            if (error) throw error;

            console.log(data);
            return data;
        } catch (error) {
            console.error("Error updating registers:", error);
            throw error;
        }
    }

    async function getRegistersByCode(student_code) {
        const { data, error } = await supabase
            .from("registers")
            .select(`*, competency_course(credit_value)`)
            .eq("student_code", student_code)
            .eq("is_deleted", false);
        if (error) throw error;
        return data;
    }

    async function insertCompetencies(competencies) {
        return await supabase.from("registers").insert(competencies).select();
    }

    async function deleteCompetencies(competencyIds) {
        return await supabase.from("registers").update({ is_deleted: true }).in("id", competencyIds);
    }

    useEffect(() => {
        Promise.all([getStudents(true), getInstitutions(true)]).then(([students, institutions]) => {
            setStudents(students);
            setInstitutions(institutions);
            setIsLoading(false);
        });
    }, []);

    return {
        isLoading,
        students,
        institutions,
        error,
        domains,
        courses,
        competencies,
        updateCompetencyStatus,
        getDomains,
        insertToDatabase,
        getCourses,
        getCompetencies,
        getRegistersByCode,
        insertCompetencies,
        deleteCompetencies,
        getRegisters,
        updateRegister,
        updateMultipleRegisters,
    };
}
