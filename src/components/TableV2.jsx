export default function Table({ columns, data, title, subtitle, isLoading }) {
    return (
        <div className="px-4 sm:px-6 lg:px-8 pt-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">{title}</h1>
                    <p className="mt-2 text-sm text-gray-700">{subtitle}</p>
                </div>
            </div>
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 mt-4">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((column) => (
                                        <th
                                            key={column.name}
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            {column.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            {!isLoading && data.length > 0 && (
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {data.map((row) => {
                                        return (
                                            <tr key={row.projectName}>
                                                {columns.map((column) => {
                                                    const value = row[column.accessor];
                                                    return (
                                                        <td
                                                            key={column.accessor}
                                                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
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
                            <div className="h-1 w-ful overflow-hidden">
                                <div className="animate-progress w-full h-full bg-nextcolor origin-left-right"></div>
                            </div>
                        )}
                        {data.length === 0 && !isLoading && (
                            <div className="px-4 py-3 text-center text-sm bg-white text-gray-900">
                                No data found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
