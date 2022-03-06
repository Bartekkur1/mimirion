import { configHandler } from "./handlers/config.handler";
import { errorMiddleware } from "./middleware/error.middleware";
import { storeHandler } from "./handlers/store.handler";

export const handlers = [
    storeHandler,
    configHandler,
];

export const middleware = [
    errorMiddleware
];