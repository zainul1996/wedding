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
    return "text-green-700 bg-green-50 ring-green-600/20";
  }
  if (status === "not attending") {
    return "text-red-800 bg-red-50 ring-red-600/20";
  }
  return "text-gray-600 bg-gray-50 ring-gray-500/10";
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
            className="divide-y divide-purple-100 rounded-lg bg-purple-100 px-7"
          >
            {invitesData.map((inviteeData) => (
              <li
                key={inviteeData.familyName}
                className="flex items-center justify-between gap-x-6 py-5"
              >
                <div className="min-w-0">
                  <div className="flex items-start gap-x-3">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {inviteeData.familyName} and Family
                    </p>
                    <p
                      className={classNames(
                        getStatusClass(inviteeData.attendingStatus),
                        "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                      )}
                    >
                      {inviteeData.attendingStatus}
                    </p>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                  <Link
                    className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
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
