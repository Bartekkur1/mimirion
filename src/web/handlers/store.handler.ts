import { Router } from "express";
import { getProvider } from '../../providers';
import { getAccessKey } from "../../util/handler.helper";
import { validateKey } from "../../util/jwt";
import { logger } from "../../util/logger";
import { adminAccess } from "../middleware/adminAccess.middleware";

export const storeHandler = Router();

const validateStoreName = (name: string) => {
    if (name === undefined || name.length < 3 || /\s/g.test(name)) {
        throw new Error('Invalid store name! minimum 3 letters, no whitespaces')
    }
};

storeHandler.put('/store/:name', adminAccess, async (req, res, next) => {
    try {
        const name = req.params['name'];
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
        const { id } = validateKey(accessKey);
        logger.debug(`Removing store...`, id);
        await getProvider().removeStore(id);
        return res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

storeHandler.get('/store', adminAccess, async (req, res, next) => {
    try {
        const stores = await getProvider().getStores();
        return res.json(stores).status(200);
    } catch (err) {
        next(err);
    }
});