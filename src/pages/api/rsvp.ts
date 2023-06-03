// src/pages/api/rsvp.ts

import { type NextApiRequest, type NextApiResponse } from "next";
import { type Response, type ResponsesData } from "../../types";
import axios from "axios";

interface RSVPRequest extends NextApiRequest {
  body: Response;
}

export default async function handler(req: RSVPRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { familyName, attendingCount, email, attending } = req.body;
    const configResponses = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://zainulandsara-default-rtdb.asia-southeast1.firebasedatabase.app/responses.json",
    };
    const responseResponses = await axios.request(configResponses);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const responsesData: ResponsesData = responseResponses.data;

    const newResponse: Response = {
      familyName,
      attendingCount:
        typeof attendingCount === "string"
          ? parseInt(attendingCount, 10)
          : attendingCount,
      email,
      attending: attending.toString() === "true",
    };

    //   if newResponse attending is false then check if the familyName is in the responsesData and if it is then remove it
    const index = responsesData.findIndex(
      (response) => response.familyName === newResponse.familyName
    );
    if (index !== -1) {
      responsesData.splice(index, 1);
    }

    responsesData.push(newResponse);
    const configResponseUpdate = {
      method: "put",
      maxBodyLength: Infinity,
      url: "https://zainulandsara-default-rtdb.asia-southeast1.firebasedatabase.app/responses.json",
      headers: {
        "Content-Type": "application/json",
      },
      data: responsesData,
    };

    axios
      .request(configResponseUpdate)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }

  res.status(200).json({ message: "RSVP successfully recorded" });
}
