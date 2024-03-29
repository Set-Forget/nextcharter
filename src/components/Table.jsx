export default function Table({ columns, data, title, subtitle, isLoading, toolbar, footer, className }) {
    return (
        <div className={`px-8 pt-8 ${className && className}`}>
            <div className="flex justify-between items-end">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">{title}</h1>
                        <p className="mt-2 text-sm text-gray-700">{subtitle}</p>
                    </div>
                </div>
                {toolbar && toolbar}
            </div>
            <div className="relative rounded-lg mt-4 border bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="text-xs font-medium text-gray-700 uppercase text-left">
                        <tr>
                            {columns.map((column) => (
                                <th key={column.name} scope="col" className="px-3 py-3.5">
                                    {column.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {!isLoading && data.length > 0 && (
                        <tbody className="divide-y divide-gray-20">
                            {data.map((row, index) => {
                                return (
                                    <tr className="" key={index}>
                                        {columns.map((column) => {
                                            const value = row[column.accessor];
                                            return (
                                                <td
                                                    key={column.accessor}
                                                    className="h-14 text-left whitespace-nowrap px-3 py-4 text-sm text-gray-600"
                                                >
                                                    {value}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </table>
                {isLoading && (
                    <div className="h-1 w-full overflow-hidden">
                        <div className="animate-progress w-full h-full bg-nextcolor origin-left-right"></div>
                    </div>
                )}
                {data.length === 0 && !isLoading && (
                    <div className="px-4 py-3 text-center text-sm bg-white text-gray-900">
                        There is no data to display
                    </div>
                )}
            </div>
            {!isLoading && data.length !== 0 && footer && footer}
        </div>
    );
}
