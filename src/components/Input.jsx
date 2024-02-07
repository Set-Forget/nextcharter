export default function Input({ label, errors, register, className, icon, ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="flex items-center text-sm font-medium leading-6 mb-1 text-gray-900">
                    {label}
                </label>
            )}
            <div className="relative rounded-md shadow-sm">
                {icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                        {icon}
                    </div>
                )}
                <input
                    className={`block w-full rounded-md border-0 py-1.5 ${
                        icon && "pl-7"
                    } text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                    {...register}
                    {...props}
                />
            </div>
            {errors && <span className="text-red-500 text-sm">{errors}</span>}
        </div>
    );
}
