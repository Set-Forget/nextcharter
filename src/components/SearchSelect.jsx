import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import { Controller } from "react-hook-form";

export default function SearchSelect({
    control,
    name,
    data,
    label,
    placeholder,
    errors,
    toolbar,
    onChange,
    optionSubtext,
    ...props
}) {
    const [query, setQuery] = useState("");

    const filteredData =
        query === "" ? data : data.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={null}
            render={({ field: { onChange: defaultOnChange, value } }) => (
                <Combobox
                    as="div"
                    className="w-full"
                    value={value}
                    onChange={onChange ? onChange : defaultOnChange}
                >
                    {label && (
                        <div className="flex items-center gap-1 mb-1">
                            <Combobox.Label className="flex items-center text-sm font-medium leading-6 text-gray-900">
                                {label}
                            </Combobox.Label>
                            {toolbar && toolbar}
                        </div>
                    )}
                    <div className="relative">
                        <Combobox.Input
                            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            displayValue={(item) => (item ? item.name : "")}
                            onChange={(e) => {
                                setQuery(e.target.value);
                            }}
                            placeholder={placeholder}
                            {...props}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Combobox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                {filteredData.map((item, index) => (
                                    <Combobox.Option
                                        key={index}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                                active ? "bg-nextcolor text-white" : "text-gray-900"
                                            }`
                                        }
                                        value={item}
                                    >
                                        {({ active }) => (
                                            <>
                                                <span
                                                    className={`block truncate text-left ${
                                                        value && value.id === item.id
                                                            ? "font-medium"
                                                            : "font-normal"
                                                    }`}
                                                >
                                                    {item.name}{" "}
                                                    {optionSubtext && item[optionSubtext.item] && (
                                                        <>
                                                            <br /> {item[optionSubtext.item]}{" "}
                                                            {optionSubtext.label}
                                                        </>
                                                    )}
                                                </span>
                                                {value && value.id === item.id ? (
                                                    <span
                                                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                                            active ? "text-white" : "text-indigo-600"
                                                        }`}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Transition>
                    </div>
                    {errors && <span className="text-red-500 text-sm">{errors}</span>}
                </Combobox>
            )}
        />
    );
}
