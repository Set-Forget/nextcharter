import PropTypes from 'prop-types';
import { forwardRef, useImperativeHandle, useRef } from "react"

const Input = forwardRef(({ label, flex, ...props }, ref) => {
  const inputRef = useRef()

  useImperativeHandle(ref, () => ({
    getValue: () => inputRef.current.value
  }))

  return (
    <div className={flex}>
      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          {...props}
          ref={inputRef}
          id="email"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  )
})

Input.displayName = "Input"
Input.propTypes = {
  label: PropTypes.string.isRequired,
  flex: PropTypes.string
}

export default Input