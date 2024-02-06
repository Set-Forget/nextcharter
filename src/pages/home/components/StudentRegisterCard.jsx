import { XMarkIcon } from "@heroicons/react/20/solid";
import Button from "../../../components/Button";

export default function StudentRegisterCard({ studentName, domainName, courses, exist, onDelete }) {
    return (
        <li className="col-span-1 flex rounded-md shadow-sm">
            <div
                className={`flex w-32 text-center flex-shrink-0 items-center justify-center ${
                    exist ? "bg-nextcolor opacity-70" : "bg-nextcolor"
                } rounded-l-md text-sm font-medium text-white`}
            >
                {studentName}
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                    <a href="#" className="font-medium text-gray-900 hover:text-gray-600">
                        {domainName}
                    </a>
                    <p className="text-gray-500 truncate">
                        Courses: {courses.map((person) => person.name).join(", ")}
                    </p>
                </div>
                <div className="flex-shrink-0 pr-2">
                    <Button variant="ghost" onClick={onDelete} type="button" className="!p-1 !rounded-full">
                        <XMarkIcon className="h-4 w-4 text-gray-400" />
                    </Button>
                </div>
            </div>
        </li>
    );
}
