import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { Fragment } from "react";

const variantClasses = {
    primary: "bg-nextcolor text-white",
    ghost: "bg-transparent text-nextcolor",
};

export default function Menu({ name, icon, variant, className, options }) {
    return (
        <HeadlessMenu as="div" className="relative inline-block text-left">
            <div>
                <HeadlessMenu.Button
                    className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-black/10 ${
                        variantClasses[variant] || variantClasses.primary
                    } ${className}`}
                >
                    {name && <span>{name}</span>}
                    {icon && icon}
                </HeadlessMenu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <HeadlessMenu.Items className="absolute z-20 right-0 my-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="px-1 py-1">
                        {options.map((option) => (
                            <HeadlessMenu.Item key={option.name}>
                                {({ active }) => (
                                    <button
                                        onClick={option.onClick}
                                        className={`${
                                            active ? "bg-nextcolor text-white" : "text-gray-900"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        {option.icon &&
                                            option.icon({
                                                className: `mr-2 h-4 w-4 text-nextcolor ${
                                                    active && "text-white"
                                                }`,
                                            })}

                                        {option.name}
                                    </button>
                                )}
                            </HeadlessMenu.Item>
                        ))}
                    </div>
                </HeadlessMenu.Items>
            </Transition>
        </HeadlessMenu>
    );
}
