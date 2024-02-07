import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";

export default function StudentCard({ people }) {
    const navigate = useNavigate();

    const handleNavigate = (studentId) => {
        navigate(`/profile/${studentId}`);
    };

    return (
        <ul
            role="list"
            className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
        >
            {people.map((person) => (
                <li
                    key={person.email}
                    className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
                    onClick={() => handleNavigate(person.code)}
                >
                    <div className="flex min-w-0 gap-x-4">
                        <Avatar name={person.name} lastname={person.lastname} />
                        <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                                <a
                                    href={person.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigate(person.code);
                                    }}
                                >
                                    <span className="absolute inset-x-0 -top-px bottom-0" />
                                    {person.name} {person.lastname}
                                </a>
                            </p>
                            <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                <a
                                    href={`mailto:${person.email}`}
                                    className="relative truncate hover:underline"
                                >
                                    {person.email}
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-x-4">
                        <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                    </div>
                </li>
            ))}
        </ul>
    );
}
