import { Response, Router } from "express";
import { ConfigProviderError } from "../providers/ConfigProvider";
import { logger } from "../util/logger";

export const handleError = (error: Error, res: Response) => {
    if (error instanceof ConfigProviderError) {
        return res.status(error.statusCode).json({
            errror: error.message
        });
    } else {
        return res.status(400).json({
            error: error.message
        });
    }
};

export const errorHandler = ((err, req, res, next) => {
    if (err) {
        logger.error(err.message);
        return handleError(err, res);
    }

    next();
});