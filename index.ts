import { json } from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import { logger } from './src/util/logger';
import { handlers, middleware } from './src/web';
import { initProvider } from './src/providers';

dotenv.config();

console.time('mimirion-start');

(async () => {
    await initProvider();
    const app = express();

    app.use(json());

    app.use(handlers);
    app.use(middleware);

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