import { NextFunction, Request, Response } from "express";
import { v4 } from "uuid";
import { logger } from "../../util/logger";

export class UnauthorizedActionException extends Error {

    public statusCode: number;

    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const keyHandler = {
    adminKey: undefined,
    getAdminKey: function () {
        if (this.adminKey === undefined) {
            if (Object.keys(process.env).includes('ADMIN_KEY')) {
                this.adminKey = process.env.ADMIN_KEY;
            } else {
                const newAdminKey = `${v4()}-${v4()}-${v4()}`
                logger.info(`Missing ADMIN_KEY env variable!`);
                logger.info(`Generated ADMIN_KEY: ${newAdminKey}`);
                this.adminKey = newAdminKey;
            }
        }

        return this.adminKey;
    }
};

/**
 * Middleware validates request headers with environment admin key
 * @throws {UnauthorizedActionException} in case of invalid admin key
 */
export const adminAccess = (req: Request, res: Response, next: NextFunction) => {

    const expectedAdminKey = keyHandler.getAdminKey();
    const providedKey = req.header('x-admin-key');

    if (providedKey === undefined || providedKey !== expectedAdminKey) {
        throw new UnauthorizedActionException('Invalid admin key!', 401);
    }

    next();
};