import { json } from 'body-parser';
import { config } from 'dotenv';
import express from 'express';
import { logger } from './src/util/logger';
import { storeHandler } from './src/web/store.handler';
import { errorHandler } from './src/web/error.handler';
import { configHandler } from './src/web/config.handler';
import { initProvider } from './src/providers';

config();

console.time('mimirion-start');

(async () => {
    await initProvider();
    const app = express();

    app.use(json());
    app.use(storeHandler);
    app.use(configHandler);

    app.use(errorHandler);
    app.use((req, res) => {
        return res.sendStatus(404);
    })

    const { PORT } = process.env;
    const serverPort = parseInt(PORT);

    app.listen(serverPort, () => {
        logger.info(`Server started on ${serverPort}`);
    });
})();


console.timeEnd('mimirion-start');