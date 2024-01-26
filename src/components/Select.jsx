import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React from "react";
import { Controller } from "react-hook-form";

export default function Select({ control, name, label, data, placeholder, errors, ...props }) {
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={null}
            render={({ field: { onChange, value } }) => (
                <Listbox as="div" className="w-full sm:max-w-md" value={value} onChange={onChange} {...props}>
                    <Listbox.Label className="flex items-center text-sm font-medium leading-6 text-gray-900">
                        {label}
                    </Listbox.Label>
                    <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            {value ? (
                                <span className="text-gray-900">{value.name}</span>
                            ) : (
                                <span className="text-gray-400">{placeholder}</span>
                            )}
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {data.map((person) => (
                                <Listbox.Option
                                    key={person.id}
                                    className={({ active }) =>
                                        `relative cursor-default text-left select-none py-2 pl-3 pr-9 ${
                                            active ? "bg-nextcolor text-white" : "text-gray-900"
                                        }`
                                    }
                                    value={person}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`${
                                                    selected ? "font-semibold" : "font-normal"
                                                } block truncate`}
                                            >
                                                {person.name}
                                            </span>

                                            {selected ? (
                                                <span
                                                    className={`${
                                                        active ? "text-white" : "text-indigo-600"
                                                    } absolute inset-y-0 right-0 flex items-center pr-4`}
                                                >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </div>
                    {errors && <span className="text-red-500 text-sm">{errors}</span>}
                </Listbox>
            )}
        />
    );
}
