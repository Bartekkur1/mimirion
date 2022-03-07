import * as jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { KeyType, StoreKeys } from '../providers/ConfigProvider';
import { getConfig } from './config';
import { logger } from './logger';

export interface TokenPayload {
    name: string;
    id: string;
    random: string;
    type: KeyType
};

const createToken = (id: string, name: string, type: KeyType) => {
    const { JWT_SECRET } = getConfig();

    if (JWT_SECRET === undefined) {
        logger.warn('JWT_SECRET is undefined, using default value!');
    }

    return jwt.sign(<TokenPayload>{
        name,
        id,
        random: v4(),
        type: KeyType.ACCESS_KEY
    }, JWT_SECRET || 'mimirionkey', {
        issuer: 'mimirion',
    });
};

export const signStore = (id: string, name: string): StoreKeys => {
    return {
        accessKey: createToken(id, name, KeyType.ACCESS_KEY),
        restoreKey: createToken(id, name, KeyType.RESTORE_KEY),
        storeId: id
    };
};

export const validateKey = (key: string): TokenPayload => {
    try {
        const { JWT_SECRET } = getConfig();
        if (JWT_SECRET === undefined) {
            logger.warn('JWT_SECRET is undefined, using default value!');
        }

        return jwt.verify(key, JWT_SECRET || 'mimirionkey') as TokenPayload;
    } catch (err) {
        throw new Error('Invalid access key!');
    }
};