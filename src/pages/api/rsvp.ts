// src/pages/api/rsvp.ts

import { type NextApiRequest, type NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { type Response, type ResponsesData } from '../../types';

interface RSVPRequest extends NextApiRequest {
    body: Response;
}

export default function handler(req: RSVPRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { familyName, attendingCount, email, attending } = req.body;

    const filePath = path.join(process.cwd(), 'src/data/responses.json');
    const responsesData: ResponsesData = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as ResponsesData;

    const newResponse: Response = {
        familyName,
        attendingCount: typeof attendingCount === 'string' ? parseInt(attendingCount, 10) : attendingCount,
        email,
        attending: attending.toString() === 'true',
      };

    //   if newResponse attending is false then check if the familyName is in the responsesData and if it is then remove it
    const index = responsesData.findIndex((response) => response.familyName === newResponse.familyName);
        if (index !== -1) {
            responsesData.splice(index, 1);
        }

    responsesData.push(newResponse);

    fs.writeFileSync(filePath, JSON.stringify(responsesData, null, 2));

    res.status(200).json({ message: 'RSVP successfully recorded' });
}
