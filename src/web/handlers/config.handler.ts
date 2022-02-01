import { Express } from "express";
import { BaseHandler } from "./base.handler";

export class ConfigHandler extends BaseHandler {

    registerPath(app: Express) {

        app.get('/:service', async (req, res) => {
            try {
                const { service } = req.params;
                const { userId } = await this.validateSession(req.header('session'));
                const { config } = await this.configProvider.getConfig(userId, service);
                return res.json(config).status(200);
            } catch (err) {
                return this.handleError(err, res);
            }
        });

        app.post('/:service', async (req, res) => {
            try {
                const { service } = req.params;
                const { userId } = await this.validateSession(req.header('session'));
                await this.configProvider.addConfig(userId, service, req.body);
                return res.sendStatus(200);
            } catch (err) {
                return this.handleError(err, res);
            }
        });

        app.delete('/:service', async (req, res) => {
            try {
                const { service } = req.params;
                const { userId } = await this.validateSession(req.header('session'));
                await this.configProvider.removeConfig(userId, service);
                return res.sendStatus(200);
            } catch (err) {
                return this.handleError(err, res);
            }
        });

    }

}