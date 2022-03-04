import { Router } from "express";
import { getProvider } from "../providers";
import { getAccessKey } from "../util/handler.helper";
import { logger } from "../util/logger";
import { ConfigStateAction } from "./types";

export const configHandler = Router();

configHandler.put('/config', async (req, res, next) => {
    try {
        const accessKey = getAccessKey(req);
        if (Object.keys(req.body).length === 0) {
            throw new Error('Invalid configuration body!');
        }

        const id = await getProvider().addConfig(accessKey, req.body);
        return res.json({ id }).status(200);
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
        const version = Number(req.params['version']);
        logger.debug(`Publishing config in version ${version}`, accessKey);
        if (action === ConfigStateAction.PUBLISH) {
            await getProvider().publishConfig(accessKey, version);
        } else {
            await getProvider().unpublishConfig(accessKey, version);
        }
        return res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

configHandler.get('/config', async (req, res, next) => {
    try {
        const accessKey = getAccessKey(req);
        logger.debug(`Fetching configuration`, accessKey);
        const { config } = await getProvider().getConfig(accessKey);
        return res.json(config).status(200);
    } catch (err) {
        next(err);
    }
});

configHandler.delete('/config/:version', async (req, res, next) => {
    try {
        const accessKey = getAccessKey(req);
        const version = Number(req.params['version']);
        logger.debug(`Removing configuration version ${version}`, accessKey);
        await getProvider().removeConfig(accessKey, version);
        return res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

configHandler.get('/config/versions', async (req, res, next) => {
    try {
        const accessKey = getAccessKey(req);
        logger.debug(`Fetching store versions`, accessKey);
        const versions = await getProvider().getVersions(accessKey);
        return res.json(versions).status(200);
    } catch (err) {
        next(err);
    }
});