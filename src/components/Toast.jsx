import { Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useObservable } from "rxjs-hooks";
import { closeToast, toastState$ } from "../store/toastState";
import {
    XMarkIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Button from "./Button";
import { useState } from "react";

export default function Toast() {
    const { open, title, subtitle, type } = useObservable(() => toastState$, {
        open: false,
        title: "",
        subtitle: "",
        type: "",
    });

    const [showCloseButton, setShowCloseButton] = useState(false);

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                closeToast();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const toastType = {
        success: "bg-green-600",
        error: "bg-red-600",
        warning: "bg-orange-600",
        "": "",
    };

    const toastIcon = {
        success: CheckCircleIcon,
        error: ExclamationCircleIcon,
        warning: ExclamationTriangleIcon,
        "": "",
    };

    const ToastIcon = toastIcon[type];

    return (
        <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-250 transform"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition ease-in duration-250 transform"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
        >
            <div
                className={`fixed z-50 gap-2 flex items-center bottom-0 right-0 p-4 m-4 rounded-lg text-sm
                    ${toastType[type]}
                `}
                onMouseEnter={() => setShowCloseButton(true)}
                onMouseLeave={() => setShowCloseButton(false)}
            >
                <Button
                    onClick={closeToast}
                    variant="ghost"
                    className={`!p-0.5 !rounded-full absolute right-1 top-1 transition-all duration-150 ${
                        showCloseButton ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <XMarkIcon className="w-4 h-4 text-white" />
                </Button>
                <ToastIcon className="w-6 h-6 text-white" />
                <div>
                    <p className="font-medium text-white">{title}</p>
                    {subtitle && <p className="text-gray-200">{subtitle}</p>}
                </div>
            </div>
        </Transition>
    );
}
