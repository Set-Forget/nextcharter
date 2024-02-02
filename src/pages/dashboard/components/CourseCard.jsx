export default function CourseCard({ title, completed }) {
    return (
        <div
            className={`min-w-24 w-24 relative rounded-md h-16 p-1 tooltip bg-white border-2 ${
                completed ? "border-green-500 text-green-500" : "border-indigo-600 text-indigo-600"
            } flex justify-center items-center text-center font-bold`}
        >
            <p className="truncate max-h-full">{title}</p>
            <div
                className={`flex min-h-[70px] max-w-max min-w-[100px] bg-white flex-col justify-center p-2 rounded-lg border-2 ${
                    completed ? "border-green-500 text-green-500" : "border-indigo-600 text-indigo-600"
                } z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible tooltip-item`}
            >
                <span>{title}</span>
            </div>
        </div>
    );
}
