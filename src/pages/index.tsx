import { type GetServerSideProps } from "next";
import Head from "next/head";
import path from "path";
import { type Invitee, type ResponsesData } from "~/types";
import fs from "fs/promises";
import Link from "next/link";
import Layout from "~/components/Layout";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";

interface Params {
  [key: string]: string | undefined;
  familyName?: string;
}

interface Props {
  invitesData: {
    attendingStatus: string;
    familyName: string;
    attendingCount: number;
    email: string;
  }[];
}

const getStatusClass = (status: string) => {
  if (status === "attending") {
    return (
      <div className="flex-none rounded-full bg-emerald-500/20 p-1">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </div>
    );
  }
  if (status === "not attending") {
    return (
      <div className="flex-none rounded-full bg-red-500/20 p-1">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
      </div>
    );
  }
  return (
    <div className="flex-none rounded-full bg-gray-500/20 p-1">
      <div className="h-1.5 w-1.5 rounded-full bg-gray-500" />
    </div>
  );
};

const Home: React.FC<Props> = ({ invitesData }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvitesData = invitesData.filter((inviteeData) =>
    inviteeData.familyName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <Head>
        <title>zainul❤️sara</title>
        <meta name="description" content="Zainul and Sara Nikkah RSVP Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="mx-auto md:w-6/12">
          <h1 className="mb-5 mt-10 text-3xl font-bold text-gray-900">
            Invite List
          </h1>
          <p className="mb-5 text-gray-600">
            Please look for your name in the list below and click the RSVP
            button to let us know if you will be attending our Nikkah ceremony.
          </p>{" "}
          <div className="mb-5 flex justify-end">
            <input
              type="text"
              placeholder="Search"
              className="w-40 rounded-md border border-gray-300 px-3 py-1 md:w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul
            role="list"
            className="divide-y divide-purple-200 rounded-lg bg-purple-100 px-7"
          >
            {filteredInvitesData.map((inviteeData) => (
              <li
                key={inviteeData.familyName}
                className="flex items-center justify-between gap-x-6 py-5"
              >
                <div className="min-w-0">
                  <div className="flex items-start gap-x-3">
                    <div className="mt-1 flex items-center gap-x-1.5">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {inviteeData.familyName} and Family
                      </p>
                      {getStatusClass(inviteeData.attendingStatus)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                  <Link
                    className="rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 md:text-sm"
                    href={`/${inviteeData.familyName}`}
                  >
                    RSVP
                    <span className="sr-only">, {inviteeData.familyName}</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props,
  Params
> = async () => {
  const configFamilies = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://zainulandsara-default-rtdb.asia-southeast1.firebasedatabase.app/families.json",
  };

  const configResponses = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://zainulandsara-default-rtdb.asia-southeast1.firebasedatabase.app/responses.json",
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const responseFamilies = await axios.request(configFamilies);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const invitesData: ResponsesData = responseFamilies.data;

    const invitesDataWithAttending = invitesData.map((invitee) => {
      return { ...invitee, attendingStatus: "none" };
    });

    console.log(invitesDataWithAttending);

    const responseResponses = await axios.request(configResponses);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const responsesData: ResponsesData = responseResponses.data;

    const invitesDataWithAttendingCount = invitesDataWithAttending.map(
      (invitee) => {
        const response = responsesData.find(
          (response) => response.familyName === invitee.familyName
        );
        if (response) {
          if (response.attending) {
            return { ...invitee, attendingStatus: "attending" };
          } else {
            return { ...invitee, attendingStatus: "not attending" };
          }
        } else {
          return invitee;
        }
      }
    );

    // sort alphabetically
    invitesDataWithAttendingCount.sort((a, b) => {
      if (a.familyName < b.familyName) {
        return -1;
      }
      if (a.familyName > b.familyName) {
        return 1;
      }
      return 0;
    });
    console.log(invitesDataWithAttendingCount);

    return {
      props: {
        invitesData: invitesDataWithAttendingCount,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        invitesData: [],
      },
    };
  }
};

export default Home;
