import { ConfigProvider } from "./providers/ConfigProvider";
import { WebServer } from "./web";
import { ConfigHandler } from "./web/handlers/config.handler";

export class Mimirion<T extends ConfigProvider> {

    private webServer: WebServer;
    private configProvider: T;

    constructor(configProvider: T) {
        this.webServer = new WebServer();
        this.configProvider = configProvider;
    }

    private initilizeHandlers() {
        const configHandler = new ConfigHandler(this.configProvider);
        this.webServer.registerHandlers(app => {
            configHandler.registerPath(app);
        });
    }

    public run() {
        this.initilizeHandlers();
        this.webServer.run();
    }

}