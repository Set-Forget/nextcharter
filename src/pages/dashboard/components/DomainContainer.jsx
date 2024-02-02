export default function DomainContainer({ title, children }) {
    return (
        <div className="shadow-md p-2 mb-8 rounded-l bg-white border-indigo-300 border-[0.5px] border-opacity-70">
            <h2 className="text-center text-indigo-500 font-semibold uppercase rounded w-[calc(6rem*3)] -mt-5 mx-auto bg-white border-indigo-300 border-[0.5px] border-opacity-70">
                {title}
            </h2>
            <div className="flex flex-col gap-4 items-center my-6">{children}</div>
        </div>
    );
}
