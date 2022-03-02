import { config } from 'dotenv';

config();

export interface Config {
    PORT: string;
    PROVIDER: string;
}

export const getConfig = () => {
    const config: Config = {
        PORT: process.env.PORT,
        PROVIDER: process.env.PROVIDER
    };

    return config;
};