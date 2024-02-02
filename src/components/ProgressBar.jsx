export default function ProgressBar({ label, progress, isLoading }) {
    return (
        <div className="ml-auto mt-6 w-96 flex flex-col items-center gap-4">
            <div className="flex w-full justify-between -mb-3">
                <p className="text-sm font-medium leading-6 mb-1 text-gray-900">{label}</p>
            </div>
            {isLoading ? (
                <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-4 w-96 bg-gray-200 rounded-full"></div>
                    <span className="sr-only">Loading...</span>
                </div>
            ) : (
                <div className="w-full bg-gray-200 rounded-full">
                    <div
                        className="bg-nextcolor text-xs transition-all duration-300 ease-in-out font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                        style={{ width: `${progress}%` }}
                    >
                        {progress}%
                    </div>
                </div>
            )}
        </div>
    );
}
