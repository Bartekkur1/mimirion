import axios, { Axios } from 'axios';
import { Config, getConfig } from './config';
import { logger } from './logger';
import { Session } from './types/session';
import { decode } from 'jsonwebtoken';

export class IgnisConnector {

    private httpClient: Axios;
    private config: Config;

    constructor() {
        this.httpClient = new Axios();
        this.config = getConfig();
    }

    async sessionValid(session: string): Promise<boolean> {
        try {
            const url = `${this.config.IGNIS_URL}/api/authentication`;
            const result = await axios.post(url, {
                session
            }, {
                headers: {
                    'x-api-key': this.config.IGNIS_KEY,
                    'x-api-client': this.config.IGNIS_CLIENT
                }
            });
            if (result.status === 200) {
                return true;
            }
        } catch (err) {
            logger.warn(`Failed to validate session: ${session}`);
            return false;
        }
        return false;
    }

    decodeSession(session: string): Session {
        return decode(session) as Session;
    }

}