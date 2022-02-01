import { config } from 'dotenv';

const { parsed } = config();

export interface Config {
    APP_PORT: string;
    PROVIDER: string;
    IGNIS_URL: string;
    IGNIS_KEY: string;
    IGNIS_CLIENT: string;
}

export const getConfig = () => {
    const parseOutput = parsed || process.env;
    const config: Config = {
        APP_PORT: parseOutput.APP_PORT,
        PROVIDER: parseOutput.PROVIDER,
        IGNIS_URL: parseOutput.IGNIS_URL,
        IGNIS_KEY: parseOutput.IGNIS_KEY,
        IGNIS_CLIENT: parseOutput.IGNIS_CLIENT
    };

    return config;
};