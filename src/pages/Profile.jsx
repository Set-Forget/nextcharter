import StudentCard from "../components/StudentCard";
import Spinner from "../components/Spinner";
import useGetData from "../hooks/useGetData";

export default function Profile() {
    const students = useGetData("student");

    if (students.isLoading) return <Spinner />;

    return (
        <main className="flex-1 bg-gray-100 place-items-center relative pb-4">
            <div className="mx-auto max-w-3xl overflow-scroll h-[calc(100vh-100px)] mt-20">
                <StudentCard people={students.data} />
            </div>
        </main>
    );
}
