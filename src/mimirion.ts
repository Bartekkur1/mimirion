import { ConfigProvider } from "./providers/ConfigProvider";
import { getConfig } from "./util/config";
import { WebServer } from "./web";
import { ConfigHandler } from "./web/handlers/config.handler";
import { providers } from './providers';
import { logger } from "./util/logger";

export class Mimirion {

    private webServer: WebServer;
    private configProvider: ConfigProvider;

    constructor() {
        this.webServer = new WebServer();
        this.configProvider = this.initilizeProvider();
    }

    private initilizeProvider() {
        const { PROVIDER } = getConfig();
        if (!Object.keys(providers).includes(PROVIDER)) {
            throw new Error('Unrecognized configuration provider!');
        } else {
            const provider = providers[PROVIDER];
            logger.info(`Using provider: ${PROVIDER}`);
            return new provider();
        }
    }

    private initilizeHandlers() {
        const configHandler = new ConfigHandler(this.configProvider);
        this.webServer.registerHandlers(app => {
            configHandler.registerPath(app);
        });
    }

    public runWeb() {
        this.initilizeHandlers();
        this.webServer.run();
    }

    public static start() {
        const instance = new Mimirion();
        instance.runWeb();
    }
}