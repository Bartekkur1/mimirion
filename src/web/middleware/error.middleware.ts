import { Response, Router } from "express";
import { ConfigProviderError } from "../../providers/ConfigProvider";
import { logger } from "../../util/logger";
import { UnauthorizedActionException } from "./adminAccess.middleware";

export const handleError = (error: Error, res: Response) => {
    if (error instanceof ConfigProviderError || error instanceof UnauthorizedActionException) {
        return res.status(error.statusCode).json({
            error: error.message
        });
    } else {
        return res.status(400).json({
            error: error.message
        });
    }
};

export const errorMiddleware = ((err, req, res, next) => {
    if (err) {
        logger.error(err.message);
        return handleError(err, res);
    }

    next();
});