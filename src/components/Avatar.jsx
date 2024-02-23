export default function Avatar({ name, lastname, className }) {
    const initials = `${name[0]}${lastname[0]}`.toUpperCase();
    return (
        <div
            className={`relative inline-flex items-center justify-center min-w-10 min-h-10 overflow-hidden bg-nextcolor rounded-full ${className}`}
        >
            <span className={`font-medium text-gray-200 ${className}`}>{initials}</span>
        </div>
    );
}
