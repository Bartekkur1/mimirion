import { config } from 'dotenv';

const { parsed } = config();

export interface Config {
    APP_PORT: string;
    PROVIDER: string;
}

export const getConfig = () => {
    const parseOutput = parsed || process.env;
    const config: Config = {
        APP_PORT: parseOutput.APP_PORT,
        PROVIDER: parseOutput.PROVIDER
    };

    return config;
};