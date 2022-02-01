import { ConfigProvider } from "../../providers/ConfigProvider";
import { Express } from 'express';
import { logger } from "../../util/logger";
import { Response } from 'express';
import apiKeys from '../../../apiKeys.json';

export abstract class BaseHandler {
    protected configProvider: ConfigProvider;

    constructor(configProvider: ConfigProvider) {
        this.configProvider = configProvider;
    }

    abstract registerPath(app: Express);

    protected handleError(err: Error, res: Response) {
        logger.error(err);
        return res.status(400).json({ error: err.message });
    };

    protected getServiceName(apiKey: string) {
        if (!Object.values(apiKeys).includes(apiKey)) {
            throw new Error('Invalid api-key!');
        }

        return Object.keys(apiKeys).find(k => apiKeys[k] === apiKey);
    }
}