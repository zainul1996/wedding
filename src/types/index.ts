// src/types/index.ts

// Define a type for a single invitee
export type Invitee = {
    familyName: string;
    inviteCount: number;
};

// Define a type for the response of a single family
export type Response = {
    familyName: string;
    attendingCount: number;
    email: string;
};

// Define the type for the data in families.json
export type FamiliesData = Invitee[];

// Define the type for the data in responses.json
export type ResponsesData = Response[];
