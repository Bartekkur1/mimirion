import { ConfigProvider } from "../../providers/ConfigProvider";
import { Express } from 'express';
import { logger } from "../../util/logger";
import { Response } from 'express';
import { IgnisConnector } from "../../util/ignis.connector";
import { Session } from "../../util/types/session";

export abstract class BaseHandler {
    protected configProvider: ConfigProvider;
    protected ignisConnector: IgnisConnector;

    constructor(configProvider: ConfigProvider) {
        this.configProvider = configProvider;
        this.ignisConnector = new IgnisConnector();
    }

    abstract registerPath(app: Express);

    protected handleError(err: Error, res: Response) {
        logger.error(err);
        return res.status(400).json({ error: err.message });
    };

    protected async validateSession(session: string): Promise<Session> {
        if (session === undefined || session === '') {
            throw new Error('Invalid session!');
        }

        const sessionValid = await this.ignisConnector.sessionValid(session);
        if (!sessionValid) {
            throw new Error('Invalid session!');
        }

        return this.ignisConnector.decodeSession(session);
    }
}