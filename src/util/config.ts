import { config } from 'dotenv';

const { parsed } = config();

export interface Config {
    PORT: string;
    PROVIDER: string;
}

export const getConfig = () => {
    const parseOutput = parsed || process.env;
    const config: Config = {
        PORT: parseOutput.PORT,
        PROVIDER: parseOutput.PROVIDER
    };

    return config;
};