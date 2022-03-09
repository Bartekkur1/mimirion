import { Router } from "express";
import { getProvider } from "../../providers";
import { getAccessKey } from "../../util/handler.helper";
import { validateKey } from "../../util/jwt";
import { logger } from "../../util/logger";
import { adminAccess } from "../middleware/adminAccess.middleware";
import { validator } from "../middleware/validator";
import {
    ConfigPatch, ConfigPatchValidator, ConfigStateAction, DeleteConfig,
    DeleteConfigValidator, GetConfig, GetConfigValidator, IdRequest, IdRequestValidator
} from "./types";

export const configHandler = Router();

/**
 * Creates new configuration inside given store id
 * Required admin access
 * Validates query store id
 */
configHandler.put('/config', adminAccess, async (req, res, next) => {
    try {
        const { id } = validator<IdRequest>(IdRequestValidator, req.query);
        const configId = await getProvider().addConfig(id, req.body);
        return res.json({ id: configId }).status(200);
    } catch (err) {
        next(err);
    }
});

/**
 * Updates configuration status by given version
 * Required admin access
 * Validates query store id, action, version
 */
configHandler.patch('/config/:action/:version', adminAccess, async (req, res, next) => {
    try {
        const { id } = validator<IdRequest>(IdRequestValidator, req.query);
        const { version, action } = validator<ConfigPatch>(ConfigPatchValidator, req.params);
        logger.debug(`Publishing config in version ${version}`, id);
        if (action === ConfigStateAction.PUBLISH) {
            await getProvider().publishConfig(id, Number(version));
        } else {
            await getProvider().unpublishConfig(id, Number(version));
        }
        return res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

/**
 * Returns given store live configuration
 * If given admin key, returns given id configuration
 */
configHandler.get('/config', async (req, res, next) => {
    try {
        let storeId = undefined;
        let configVersion = undefined;
        if (req.header('x-admin-key')) {
            const { id, version } = validator<GetConfig>(GetConfigValidator, req.query);
            configVersion = version;
            storeId = id;
        } else {
            const accessKey = getAccessKey(req);
            const validationResult = validateKey(accessKey);
            storeId = validationResult.id;
        }
        logger.debug(`Fetching configuration`, storeId);
        const { config } = await getProvider().getConfig(storeId, configVersion);
        return res.json(config).status(200);
    } catch (err) {
        next(err);
    }
});

/**
 * Removes configuration given version
 * Required admin access
 * Validates query store id
 */
configHandler.delete('/config/:version', adminAccess, async (req, res, next) => {
    try {
        const { id, version } = validator<DeleteConfig>(DeleteConfigValidator, req.query);
        logger.debug(`Removing configuration version ${version}`, id);
        await getProvider().removeConfig(id, version);
        return res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

/**
 * Returns list of given configuration versions
 * Required admin access
 * Validates query store id
 */
configHandler.get('/config/versions', adminAccess, async (req, res, next) => {
    try {
        const { id } = validator<IdRequest>(IdRequestValidator, req.query);
        logger.debug(`Fetching store versions`, id);
        const versions = await getProvider().getVersions(id);
        return res.json(versions).status(200);
    } catch (err) {
        next(err);
    }
});