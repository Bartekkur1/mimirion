export interface ConfigStore {
    id: string;
    name: string;
    liveVersion: number;
    configurations: Config[];
};

export interface Config {
    id: string;
    version: ConfigVersion;
    config: Object;
};

export interface StoreKeys {
    accessKey: string;
    restoreKey: string;
};

export enum KeyType {
    ACCESS_KEY = 'ACCESS_KEY',
    RESTORE_KEY = 'RESTORE_KEY'
};

export interface ConfigVersion {
    id: number;
    createdAt: number;
    live: boolean;
};

export class ConfigProviderError extends Error {
    statusCode: number;

    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
};

export interface ConfigProvider {

    /**
     * Initialization method, use your async methods here
     */
    init(): Promise<void> | void;

    /**
     * Creates new store record
     * @param name new store name
     * @returns access key of a new store
     */
    createStore(name: string): Promise<StoreKeys> | StoreKeys;

    /**
     * Removes store with all configurations
     * @param accessKey store key
     */
    removeStore(accessKey: string): Promise<void> | void;

    /**
     * Creates new pair of store keys
     * @param restoreKey
     * @throws {ConfigProviderError} Will throw error in case of invalid restoreKey
     */
    restoreStore(restoreKey: string): Promise<StoreKeys> | StoreKeys;

    /**
     * Adds new configuration into given store
     * @param accessKey store key
     * @param config configuration object instance
     * @returns id of a new configuration
     * @throws {ConfigProviderError} Will throw error in case of invalid accessKey or invalid configuration object
     */
    addConfig(accessKey: string, config: Object): Promise<string> | string;

    /**
     * Publish new configuration
     * @param accessKey store key
     * @param version version number to publish
     * @throws {ConfigProviderError} Will throw error in case of invalid accessKey or invalid version number
     */
    publishConfig(accessKey: string, version: number): Promise<void> | void;

    /**
     * Sets given version live status to false
     * @param accessKey store key
     * @param version to remove
     */
    unpublishConfig(accessKey: string, version: number): Promise<void> | void;

    /**
     * Returns given accessKey store current live configuration
     * Returns undefined if there is no live version
     * @param accessKey store key
     * @throws {ConfigProviderError} Will throw error in case of invalid accessKey or not published config
     */
    getConfig(accessKey: string): Promise<Config> | Config;

    /**
     * Removes given accessKey store configuration of given version
     * @param accessKey store key
     * @param version 
     * @throws {ConfigProviderError} Will throw error in case of invalid accessKey or invalid version number
     */
    removeConfig(accessKey: string, version: number): Promise<void> | void;

    /**
     * Returns list of configuration versions and creation dates
     * @param accessKey store key
     */
    getVersions(accessKey: string): Promise<ConfigVersion[]> | ConfigVersion[];

    /**
     * Returns new, unique incremented version number
     * @param store
     */
    getNewVersionLabel(store: ConfigStore): Promise<number> | number;
};