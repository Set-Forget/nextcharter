import PropTypes from "prop-types";
import { forwardRef, useImperativeHandle, useRef } from "react";

const Input = forwardRef(({ label, flex, required, errors, ...props }, ref) => {
    const inputRef = useRef();

    useImperativeHandle(ref, () => ({
        getValue: () => inputRef.current.value,
    }));

    return (
        <div className={`${flex ?? ""}`}>
            <label
                htmlFor="email"
                className={`block text-sm font-medium leading-6 text-gray-900 ${
                    required && "after:content-['*'] after:ml-1 after:text-red-500"
                }`}
            >
                {label}
            </label>
            <input
                {...props}
                ref={inputRef}
                id="email"
                className="block w-full rounded-md mt-4 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {errors && <span className="text-red-500 text-sm">{errors}</span>}
        </div>
    );
});

Input.displayName = "Input";
Input.propTypes = {
    label: PropTypes.string.isRequired,
    flex: PropTypes.string,
};

export default Input;
