import { Router } from "express";
import { getProvider } from '../providers';
import { getAccessKey } from "../util/handler.helper";
import { logger } from "../util/logger";

export const storeHandler = Router();

const validateStoreName = (name: string) => {
    if (name === undefined || name.length < 3 || /\s/g.test(name)) {
        throw new Error('Invalid store name! minimum 3 letters, no whitespaces')
    }
};

storeHandler.put('/store/:name', async (req, res, next) => {
    try {
        const name = req.params['name']
        validateStoreName(name);

        logger.debug(`Creating store...`, name);
        const keys = await getProvider().createStore(name);
        return res.json({
            message: 'SAVE THESE KEYS, YOU WONT SEE THEM AGAIN',
            ...keys
        });
    } catch (err) {
        next(err);
    }
});

storeHandler.delete('/store', async (req, res, next) => {
    try {
        const accessKey = getAccessKey(req);
        logger.debug(`Removing store...`, accessKey);
        await getProvider().removeStore(accessKey);
        return res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});