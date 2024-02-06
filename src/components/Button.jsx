export default function Button({ children, className, isLoading, disabled, ...props }) {
    const buttonVariantClasses = {
        primary: "bg-nextcolor hover:hover:bg-nextcolor/90 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        link: "bg-transparent hover:bg-transparent text-blue-600 hover:underline !p-0",
        danger: "bg-red-700 hover:bg-red-600 text-white",
        success: "bg-green-600 hover:bg-green-700 text-white",
        ghost: "bg-transparent hover:bg-black/5 text-gray-800",
    };

    const buttonSizeClasses = {
        sm: "px-2.5 py-1.5 text-xs",
        md: "px-3 py-2 text-sm",
        lg: "px-4 py-2 text-base",
    };

    return (
        <button
            className={`${className} rounded-md justify-center ${
                buttonVariantClasses[props.variant] || buttonVariantClasses.primary
            } flex ${
                buttonSizeClasses[props.size] || buttonSizeClasses.md
            } font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                disabled && "opacity-50"
            }`}
            disabled={disabled}
            {...props}
        >
            {isLoading && (
                <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            {children}
        </button>
    );
}
