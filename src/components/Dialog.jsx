import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useObservable } from "rxjs-hooks";
import { closeDialog, dialogState$ } from "../store/dialogState";
import Button from "./Button";

export default function Dialog() {
    const { open, title, description, onConfirm } = useObservable(() => dialogState$, {
        open: false,
        title: "",
        description: "",
        payload: null,
        onConfirm: () => {},
    });

    const handleClose = () => {
        closeDialog();
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <HeadlessDialog as="div" className="relative z-50" onClose={handleClose}>
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

                <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
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
                            <HeadlessDialog.Panel className="relative z-50 transform max-h-[600px] overflow-auto rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-5 py-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-left w-full">
                                            <HeadlessDialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-7 text-gray-900"
                                            >
                                                {title}
                                            </HeadlessDialog.Title>
                                            <p className="max-w-2xl text-sm leading-6 text-gray-500">
                                                {description}
                                            </p>
                                            <div className="flex gap-2 mt-4 justify-end">
                                                <Button
                                                    onClick={() => {
                                                        onConfirm();
                                                        handleClose();
                                                    }}
                                                >
                                                    Confirm
                                                </Button>
                                                <Button onClick={handleClose} variant="ghost">
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </HeadlessDialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </HeadlessDialog>
        </Transition.Root>
    );
}
