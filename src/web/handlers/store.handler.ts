import { Router } from "express";
import { getProvider } from '../../providers';
import { logger } from "../../util/logger";
import { adminAccess } from "../middleware/adminAccess.middleware";
import { validator } from "../middleware/validator";
import { IdRequest, IdRequestValidator, NameValidator, PutStore } from "./types";

export const storeHandler = Router();

/**
 * Creates new store with given name
 * Required admin access
 */
storeHandler.put('/store/:name', adminAccess, async (req, res, next) => {
    try {
        const { name } = validator<PutStore>(NameValidator, req.params);
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

/**
 * Removes store by given id
 * Required admin access
 * Validates query store id
 */
storeHandler.delete('/store', adminAccess, async (req, res, next) => {
    try {
        const { id } = validator<IdRequest>(IdRequestValidator, req.query);
        logger.debug(`Removing store...`, id);
        await getProvider().removeStore(id);
        return res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

/**
 * Returns list of stores
 * Required admin access
 * Validates query store id
 */
storeHandler.get('/store', adminAccess, async (req, res, next) => {
    try {
        const stores = await getProvider().getStores();
        return res.json(stores).status(200);
    } catch (err) {
        next(err);
    }
});