import { Request } from "express";

export const getAccessKey = (request: Request) => {
    const accessKey = request.header('x-access-key');
    if (accessKey === undefined) {
        throw new Error('Access key not provided!');
    }

    return accessKey;
};