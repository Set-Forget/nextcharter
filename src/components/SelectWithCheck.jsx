import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SelectWithCheck({
  label,
  people,
  selected,
  setSelected,
  handleAdd,
  domainTableData,
  instDomainTableData,
  selectedInstitution,
  ...props
}) {
  // const [selected, setSelected] = useState({ name: '' })

  return (
    <Listbox value={selected} onChange={setSelected} {...props}>
      {({ open }) => (
        <>
          <Listbox.Label className=" flex items-center text-sm font-medium leading-6 text-gray-900">
            {label}
            {handleAdd && (
              <svg
                className="h-3 w-3 ml-1 bg-nextcolor rounded-full cursor-pointer"
                viewBox="0 0 20 20"
                fill="#fff"
                aria-hidden="true"
                onClick={handleAdd}
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
            )}
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              {props.multiple ? (
                <span className="block truncate">
                  {selected.map((person) => person.name).join(", ") || "Select"}
                </span>
              ) : (
                <span className="block truncate">
                  {selected.name || "Select"}
                </span>
              )}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {people.map((person) => {
                  let creditsRequired = null;
                  if (domainTableData && instDomainTableData) {
                    const matchingInstDomain = instDomainTableData.find(
                      (instDomain) => instDomain.id === person.inst_domain_id
                    );

                    if (matchingInstDomain) {
                      const matchingDomain = domainTableData.find(
                        (domain) => domain.id === matchingInstDomain.domain_id
                      );
                      if (matchingDomain) {
                        creditsRequired = matchingDomain.credits_required;
                      }
                    }
                  }
                  return (
                    <Listbox.Option
                      key={person.id}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-nextcolor text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={person}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {person.name}
                          </span>
                          {creditsRequired && selectedInstitution != '969d886e-4e4e-45a8-b872-13a6ee137ff2' ? (
                            <span className="right-1">
                              {creditsRequired} credits required
                            </span>
                          ) : (
                            <></>
                          )}

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
