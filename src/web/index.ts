import { json } from 'body-parser';
import express, { Express } from 'express';
import { getConfig } from '../util/config';
import { logger } from '../util/logger';

type registrationHandler = (app: Express) => void;

export class WebServer {

    private app: Express;

    constructor() {
        this.app = express();
    }

    public registerHandlers(handler: registrationHandler) {
        this.app.use(json());
        handler(this.app);
    }

    public run() {
        const { APP_PORT } = getConfig();
        const serverPort = parseInt(APP_PORT);
        this.app.listen(serverPort, () => {
            logger.info(`Server started on ${serverPort}`);
        });
    }

};