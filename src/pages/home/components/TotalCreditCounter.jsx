export default function TotalCreditCounter({ totalCredits, nonExistingCredits }) {
    return (
        <h3
            className={`${
                totalCredits > 20 && nonExistingCredits > 0
                    ? "text-red-500"
                    : nonExistingCredits === 0
                    ? "text-gray-400"
                    : "text-green-500"
            } p-2 rounded-lg mb-2 shadow-sm bg-white border border-gray-200 font-medium`}
        >
            Total credits: <b>{totalCredits}</b> / 20
        </h3>
    );
}
