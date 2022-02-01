import { Express } from "express";
import { BaseHandler } from "./base.handler";

export class ConfigHandler extends BaseHandler {

    registerPath(app: Express) {

        app.get('/', async (req, res) => {
            try {
                const service = this.getServiceName(req.header('x-api-key'));
                const { config } = await this.configProvider.getConfig(service);
                return res.json(config).status(200);
            } catch (err) {
                return this.handleError(err, res);
            }
        });

        app.post('/', async (req, res) => {
            try {
                const service = this.getServiceName(req.header('x-api-key'));
                await this.configProvider.addConfig(service, req.body);
                return res.sendStatus(200);
            } catch (err) {
                return this.handleError(err, res);
            }
        });

        app.delete('/', async (req, res) => {
            try {
                const service = this.getServiceName(req.header('x-api-key'));
                await this.configProvider.removeConfig(service);
                return res.sendStatus(200);
            } catch (err) {
                return this.handleError(err, res);
            }
        });

    }

}