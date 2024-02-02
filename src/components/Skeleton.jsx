export default function Skeleton() {
    return (
        <div role="status" className="max-w-sm animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <span className="sr-only">Loading...</span>
        </div>
    );
}
