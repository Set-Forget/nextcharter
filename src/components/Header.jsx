import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { supabase } from "../lib/api";

export default function Header({ navItems }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        localStorage.clear();
    }

    const userRole = localStorage.getItem("userRole");

    return (
        <header className="absolute inset-x-0 top-0 z-[100] shadow-md bg-nextcolor">
            <nav
                className="flex items-center justify-around px-8 py-4 gap-4 container mx-auto"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        {/* <span className="sr-only">Your Company</span> */}
                        <img
                            className="h-8"
                            src="https://nextcharterschool.org/wp-content/uploads/2020/08/logo.png"
                            alt=""
                        />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navItems.map((item) => (
                            <NavLink
                                to={item.href}
                                key={item.name}
                                className="text-sm font-semibold leading-6 text-white"
                            >
                                {item.name}
                            </NavLink>
                        ))}
                        {(navItems.length > 0 || userRole == "student") && (
                            <a
                                href="#"
                                className="text-sm font-semibold leading-6 text-white"
                                onClick={signOut}
                            >
                                Log out <span aria-hidden="true">&rarr;</span>
                            </a>
                        )}
                    </div>
                </div>
            </nav>
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-50" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5 bg-nextcolor">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-8 w-auto"
                                src="https://nextcharterschool.org/wp-content/uploads/2020/08/logo.png"
                                alt=""
                            />
                        </a>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    );
}
