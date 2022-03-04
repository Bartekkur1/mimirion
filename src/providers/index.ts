import { logger } from "../util/logger";
import { ConfigProvider } from "./ConfigProvider";
import MemoryProvider from "./memory/MemoryProvider";

export const providers = {
    'memory': MemoryProvider
};

let provider: ConfigProvider | undefined;

export const initProvider = async () => {
    const { PROVIDER } = process.env;
    if (PROVIDER === undefined || !Object.keys(providers).includes(PROVIDER)) {
        throw new Error('Unrecognized configuration provider!');
    }

    if (provider === undefined) {
        const providerClass = providers[PROVIDER];
        logger.info(`Using provider: ${PROVIDER}`);
        provider = new providerClass();
        await provider.init();
    }
}

export const getProvider = () => provider;