import { type GetServerSideProps } from "next";
import Head from "next/head";
import path from "path";
import { type Invitee, type ResponsesData } from "~/types";
import fs from "fs/promises";
import Link from "next/link";
import Layout from "~/components/Layout";

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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Home: React.FC<Props> = ({ invitesData }) => {
  console.log(invitesData);
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
          </h1>{" "}
          {/* Add a heading to the page */}
          <p className="mb-5 text-gray-600">
            Please look for your name in the list below and click the RSVP
            button to let us know if you will be attending our Nikkah ceremony.
          </p>{" "}
          {/* Add instructions for the user */}
          <ul
            role="list"
            className="divide-y divide-purple-200 rounded-lg bg-purple-100 px-7"
          >
            {invitesData.map((inviteeData) => (
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
  const familiesFilePath = path.join(process.cwd(), "src/data/families.json");
  const invitesDataJson = await fs.readFile(familiesFilePath, "utf-8");
  const invitesData: ResponsesData = JSON.parse(
    invitesDataJson
  ) as ResponsesData;

  const invitesDataWithAttending = invitesData.map((invitee) => {
    return { ...invitee, attendingStatus: "none" };
  });

  const responsesFilePath = path.join(process.cwd(), "src/data/responses.json");
  const responsesDataJson = await fs.readFile(responsesFilePath, "utf-8");
  const responsesData: ResponsesData = JSON.parse(
    responsesDataJson
  ) as ResponsesData;
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

  return {
    props: {
      invitesData: invitesDataWithAttendingCount,
    },
  };
};

export default Home;
