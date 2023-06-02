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
    console.log(req.body);
    const { familyName, attendingCount, email } = req.body;


    if (!familyName || attendingCount === undefined || !email) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const filePath = path.join(process.cwd(), 'src/data/responses.json');
    const responsesData: ResponsesData = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as ResponsesData;

    const newResponse: Response = {
        familyName,
        attendingCount,
        email,
    };

    responsesData.push(newResponse);

    fs.writeFileSync(filePath, JSON.stringify(responsesData, null, 2));

    res.status(200).json({ message: 'RSVP successfully recorded' });
}
