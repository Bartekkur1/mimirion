import { Router } from "express";
import { getProvider } from "../../providers";
import { getAccessKey } from "../../util/handler.helper";
import { validateKey } from "../../util/jwt";
import { logger } from "../../util/logger";
import { ConfigStateAction } from "../types";

export const configHandler = Router();

configHandler.put('/config', async (req, res, next) => {
    try {
        const accessKey = getAccessKey(req);
        const { id } = validateKey(accessKey);
        if (Object.keys(req.body).length === 0) {
            throw new Error('Invalid configuration body!');
        }

        const configId = await getProvider().addConfig(id, req.body);
        return res.json({ id: configId }).status(200);
    } catch (err) {
        next(err);
    }
});

configHandler.patch('/config/:action/:version', async (req, res, next) => {
    try {
        const action = req.params['action'] as ConfigStateAction;
        if (action !== 'publish' && action !== 'unpublish') {
            throw new Error('Invalid action!');
        }
        const accessKey = getAccessKey(req);
        const { id } = validateKey(accessKey);
        const version = Number(req.params['version']);
        logger.debug(`Publishing config in version ${version}`, id);
        if (action === ConfigStateAction.PUBLISH) {
            await getProvider().publishConfig(id, version);
        } else {
            await getProvider().unpublishConfig(id, version);
        }
        return res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

configHandler.get('/config', async (req, res, next) => {
    try {
        let id = undefined;
        if (req.header('x-admin-key')) {
            id = req.query.id;
        } else {
            const accessKey = getAccessKey(req);
            const validationResult = validateKey(accessKey);
            id = validationResult.id;
        }
        logger.debug(`Fetching configuration`, id);
        const { config } = await getProvider().getConfig(id);
        return res.json(config).status(200);
    } catch (err) {
        next(err);
    }
});

configHandler.delete('/config/:version', async (req, res, next) => {
    try {
        const accessKey = getAccessKey(req);
        const version = Number(req.params['version']);
        const { id } = validateKey(accessKey);
        logger.debug(`Removing configuration version ${version}`, id);
        await getProvider().removeConfig(id, version);
        return res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

configHandler.get('/config/versions', async (req, res, next) => {
    try {
        const accessKey = getAccessKey(req);
        const { id } = validateKey(accessKey);
        logger.debug(`Fetching store versions`, id);
        const versions = await getProvider().getVersions(id);
        return res.json(versions).status(200);
    } catch (err) {
        next(err);
    }
});