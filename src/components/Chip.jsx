export default function Chip({ label, color }) {
    return (
        <span
            className={`${
                color ? color : "bg-nextcolor"
            } text-white text-xs font-medium me-2 px-2.5 py-1 rounded-full`}
        >
            {label}
        </span>
    );
}
