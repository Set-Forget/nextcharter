import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { useObservable } from "rxjs-hooks";
import { closeModal, modalState$ } from "../store/modalState";

export default function Modal() {
    const { open, view, title, subtitle } = useObservable(() => modalState$, {
        open: false,
        payload: null,
        view: null,
        title: "",
        subtitle: "",
    });

    const modalRef = useRef(null);

    const handleClose = () => {
        closeModal();
    };

    const afterEnter = () => {
        if (modalRef.current) {
            modalRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
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

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            afterEnter={afterEnter}
                        >
                            <Dialog.Panel
                                ref={modalRef}
                                className="relative z-10 transform max-h-[600px] overflow-auto rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                            >
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-center w-full">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-7 text-gray-900"
                                            >
                                                {title}
                                            </Dialog.Title>
                                            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                                                {subtitle}
                                            </p>
                                            <div className="mt-2">{view}</div>
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
