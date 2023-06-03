// src/components/RSVPForm.tsx

import React, { useState, Fragment, useEffect } from "react";
import { type Invitee } from "../types";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

interface RSVPFormProps {
  invitee: Invitee;
  onFormSubmit: (
    familyName: string,
    attendingCount: number,
    email: string,
    attending: boolean
  ) => Promise<void>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const RSVPForm: React.FC<RSVPFormProps> = ({ invitee, onFormSubmit }) => {
  type Pax = { id: number; name: string };

  const number_of_pax: Pax[] = [];

  for (let i = 1; i <= invitee.inviteCount; i++) {
    number_of_pax.push({ id: i, name: i.toString() });
  }
  const [attendingCount, setAttendingCount] = useState(0);
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState(number_of_pax[0]);
  const [emailValid, setEmailValid] = useState(true);

  useEffect(() => {
    console.log(selected?.name);
    // convert to number
  }, [selected]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onFormSubmit(invitee.familyName, Number(selected?.name), email, true)
      .then(() => {
        setAttendingCount(0);
        setEmail("");
      })
      .catch(console.error);
  };

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setEmail(value);
    setEmailValid(
      value === "" ||
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
    );
  }
  return (
    <div className="mt-5 rounded-xl border-b border-gray-200 bg-purple-100 px-4 py-5 sm:px-6">
      <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-4">
          <form onSubmit={handleSubmit}>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Thanks for choosing to attend! You&apos;ve been given{" "}
              {invitee.inviteCount} invites.
            </h3>
            <p className="text-md mt-1 text-gray-600">
              Please fill up the form below to complete your RSVP.
            </p>
            <Listbox value={selected} onChange={setSelected}>
              {({ open }) => (
                <>
                  <Listbox.Label className="mt-4 block text-sm font-medium leading-6 text-gray-900">
                    Number of attendees
                  </Listbox.Label>
                  <div className="relative mt-2">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                      <span className="block truncate">{selected?.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>

                    <Transition
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {number_of_pax.map((person) => (
                          <Listbox.Option
                            key={person?.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900",
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
                                  {person?.name}
                                </span>

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
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
            <div>
              <label
                htmlFor="email"
                className="mt-4 block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ${
                    emailValid && email !== ""
                      ? "ring-green-300"
                      : emailValid
                      ? ""
                      : "ring-red-300"
                  } placeholder:text-gray-300 focus:ring-2 focus:ring-inset ${
                    emailValid && email !== ""
                      ? "focus:ring-green-500"
                      : emailValid
                      ? ""
                      : "focus:ring-red-500"
                  } sm:text-sm sm:leading-6`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  aria-invalid={!emailValid}
                  aria-describedby="email-error"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  {emailValid && email !== "" ? (
                    <CheckIcon
                      className="h-5 w-5 text-green-500"
                      aria-hidden="true"
                    />
                  ) : emailValid ? null : (
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
              {!emailValid && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  Not a valid email address.
                </p>
              )}
              {emailValid && (
                <p
                  className="mt-2 text-sm text-gray-500"
                  id="email-description"
                >
                  We&apos;ll only use this to send the rsvp confirmation.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="mt-4 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RSVPForm;
