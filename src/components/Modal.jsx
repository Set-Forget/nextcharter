import { Fragment, useRef } from "react";
import PropTypes from "prop-types";
import { Dialog, Transition } from "@headlessui/react";
// import { CheckIcon } from '@heroicons/react/24/outline'

export default function Modal({
  title,
  children,
  open,
  setOpen,
  disabled,
  handleSubmit,
  showSuccessIcon,
  showErrorMessage,
}) {
  const cancelButtonRef = useRef(null);

  function renderContent() {
    if (showSuccessIcon) {
      return (
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            animation: "fadeIn 2s",
            zIndex: "20",
            height: "300px",
            alignItems: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#63F172"
            className="w-24 h-24"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="font-semibold">Success!</h2>
          <p className="text-center w-[380px]">
            Competency added.
          </p>
        </div>
      );
    } else if (showErrorMessage) {
      return (
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            animation: "fadeIn 2s",
            zIndex: "20",
            height: "300px",
            alignItems: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#E54040"
            className="w-24 h-24"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="font-semibold">An error ocurred.</h2>
          <p className="text-center w-[380px]">
            Please, verify you are not duplicating competencies or try again
            later.
          </p>
        </div>
      );
    } else {
      return (
        <>
          <div>
            <div className="mt-1 sm:mt-2">
              <Dialog.Title
                as="h3"
                className="text-base font-semibold leading-6 text-gray-900 text-center"
              >
                {title}
              </Dialog.Title>
              <div className="mt-2">{children}</div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-nextcolor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
              onClick={handleSubmit}
            >
              Add
            </button>
            <button
              disabled={disabled}
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              onClick={setOpen}
              ref={cancelButtonRef}
            >
              Cancel
            </button>
          </div>
        </>
      );
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                {renderContent()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
