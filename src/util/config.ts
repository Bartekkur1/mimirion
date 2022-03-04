import { config } from 'dotenv';

config();

export interface Config {
    PORT: string;
    PROVIDER: string;
    JWT_SECRET: string;
}

export const getConfig = () => {
    const config: Config = {
        PORT: process.env.PORT,
        PROVIDER: process.env.PROVIDER,
        JWT_SECRET: process.env.JWT_SECRET
    };

    return config;
};