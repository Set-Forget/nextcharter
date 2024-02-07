import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { useObservable } from "rxjs-hooks";
import { closeModal, modalState$, setModalState } from "../store/modalState";
import { XMarkIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";

import Button from "./Button";

export default function Modal() {
    const { open, view, title, subtitle, previous } = useObservable(() => modalState$, {
        open: false,
        payload: null,
        view: null,
        title: "",
        subtitle: "",
        previous: null,
    });

    const modalRef = useRef(null);

    const handlePrevious = () => {
        const { payload, view, title, subtitle } = previous;

        setModalState({
            open: true,
            payload: payload,
            view: view ?? null,
            title: title,
            subtitle: subtitle,
            previous: null,
        });
    };

    const handleClose = () => {
        closeModal();
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {}} onClick={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        aria-hidden="true"
                    />
                </Transition.Child>
                <div className="fixed inset-0 z-10">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                ref={modalRef}
                                className="relative w-min min-w-[500px] max-w-7xl z-10 rounded-lg transform bg-white text-left shadow-xl transition-all my-8"
                            >
                                <div className="bg-white pt-5 rounded-lg">
                                    <div className="flex flex-col items-center">
                                        <div className="text-center w-full">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-7 text-gray-900"
                                            >
                                                {title}
                                            </Dialog.Title>
                                            <p className="mt-1 text-sm leading-6 text-gray-500">{subtitle}</p>
                                            <Button
                                                className="absolute top-2 left-2 !p-1.5 !rounded-full !text-gray-600"
                                                variant="ghost"
                                                disabled={!previous}
                                                onClick={handlePrevious}
                                            >
                                                <ArrowLeftIcon className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                className="absolute top-2 right-2 !p-1.5 !rounded-full !text-gray-600"
                                                variant="ghost"
                                                onClick={handleClose}
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </Button>
                                            <div className="mt-2 overflow-y-auto overflow-x-hidden max-h-[600px] px-5 pb-5">
                                                {view}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
