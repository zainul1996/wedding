// src/pages/[familyName].tsx

import { useState, Fragment } from "react";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { type Invitee, type ResponsesData } from "../types";
import RSVPForm from "../components/RSVPForm";
import Layout from "../components/Layout";
import path from "path";
import fs from "fs/promises";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios, { AxiosError, AxiosResponse } from "axios";

interface FamilyNameProps {
  invitee: Invitee;
}
const people = [
  { id: 1, name: "Attending", online: true },
  { id: 2, name: "Not Attending", online: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const FamilyNamePage: React.FC<FamilyNameProps> = ({ invitee }) => {
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(people[1]);
  const router = useRouter();

  const handleFormSubmit = async (
    familyName: string,
    attendingCount: number,
    email: string,
    attending: boolean
  ) => {
    setSubmitting(true);
    try {
      console.log(attending);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const urlencoded = new URLSearchParams();
      urlencoded.append("familyName", familyName);
      urlencoded.append("attendingCount", String(attendingCount));
      urlencoded.append("email", email);
      urlencoded.append("attending", String(attending));

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      const response = await fetch("/api/rsvp", requestOptions);

      if (!response.ok) {
        throw new Error(
          `RSVP failed: ${response.statusText} (${response.status})`
        );
      }

      router.push("/submitted").catch(console.error);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitNotAttending = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitting RSVP");
    handleFormSubmit(invitee.familyName, 0, "-", false).catch(console.error);
  };

  return (
    <Layout>
      <div className="rounded-xl border-b border-gray-200 bg-purple-100 px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-4">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Dear family of {invitee.familyName}
            </h3>
            <p className="text-md mt-1 text-gray-600">
              Please update your RSVP status
            </p>
          </div>
          <div className="ml-4 mt-4 flex-shrink-0">
            <Listbox value={selected} onChange={setSelected}>
              {({ open }) => (
                <>
                  <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    RSVP Status:
                  </Listbox.Label>
                  <div className="relative mt-2">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                      <span className="flex items-center">
                        <span
                          aria-label={selected?.online ? "Online" : "Offline"}
                          className={classNames(
                            selected?.online ? "bg-green-400" : "bg-red-400",
                            "inline-block h-2 w-2 flex-shrink-0 rounded-full"
                          )}
                        />
                        <span className="ml-3 block truncate">
                          {selected?.name}
                        </span>
                      </span>
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
                        {people.map((person) => (
                          <Listbox.Option
                            key={person.id}
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
                                <div className="flex items-center">
                                  <span
                                    className={classNames(
                                      person.online
                                        ? "bg-green-400"
                                        : "bg-red-400",
                                      "inline-block h-2 w-2 flex-shrink-0 rounded-full"
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "ml-3 block truncate"
                                    )}
                                  >
                                    {person.name}
                                    <span className="sr-only">
                                      {" "}
                                      is {person.online ? "online" : "offline"}
                                    </span>
                                  </span>
                                </div>

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
          </div>
        </div>
      </div>
      {selected?.name == "Attending" ? (
        <RSVPForm invitee={invitee} onFormSubmit={handleFormSubmit} />
      ) : (
        <button
          type="submit"
          className="mt-4 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleSubmitNotAttending}
        >
          Submit
        </button>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  if (!params || typeof params.familyName !== "string") {
    return {
      notFound: true,
    };
  }
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://zainulandsara-default-rtdb.asia-southeast1.firebasedatabase.app/families.json",
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const response = (await axios.request(
      config
    )) as AxiosResponse<ResponsesData>;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const invitesData: ResponsesData = response.data;

    const invitee = invitesData.find(
      (invitee) => invitee.familyName === params.familyName
    );

    if (!invitee) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        invitee,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default FamilyNamePage;
