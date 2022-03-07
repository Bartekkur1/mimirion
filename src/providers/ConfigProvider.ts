export interface StoreDetails {
    id: string;
    name: string;
    liveVersion: number;
    createdAt: number;
};

export interface ConfigStore extends StoreDetails {
    configurations: Config[];
};

export interface Config {
    id: string;
    version: ConfigVersion;
    config: Object;
};

export interface StoreKeys {
    storeId: string;
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
     * @param id store id
     */
    removeStore(id: string): Promise<void> | void;

    /**
     * Returns list of created stores
     */
    getStores(): Promise<StoreDetails[]> | StoreDetails[];

    /**
     * Creates new pair of store keys
     * @param restoreKey
     * @throws {ConfigProviderError} Will throw error in case of invalid restoreKey
     */
    restoreStore(id: string): Promise<StoreKeys> | StoreKeys;

    /**
     * Adds new configuration into given store
     * @param id store id
     * @param config configuration object instance
     * @returns id of a new configuration
     * @throws {ConfigProviderError} Will throw error in case of invalid id or invalid configuration object
     */
    addConfig(id: string, config: Object): Promise<string> | string;

    /**
     * Publish new configuration
     * @param id store id
     * @param version version number to publish
     * @throws {ConfigProviderError} Will throw error in case of invalid id or invalid version number
     */
    publishConfig(id: string, version: number): Promise<void> | void;

    /**
     * Sets given version live status to false
     * @param id store id
     * @param version to remove
     */
    unpublishConfig(id: string, version: number): Promise<void> | void;

    /**
     * Returns given id store current live configuration
     * Returns undefined if there is no live version
     * @param id store id
     * @throws {ConfigProviderError} Will throw error in case of invalid id or not published config
     */
    getConfig(id: string): Promise<Config> | Config;

    /**
     * Removes given id store configuration of given version
     * @param id store id
     * @param version 
     * @throws {ConfigProviderError} Will throw error in case of invalid id or invalid version number
     */
    removeConfig(id: string, version: number): Promise<void> | void;

    /**
     * Returns list of configuration versions and creation dates
     * @param id store id
     */
    getVersions(id: string): Promise<ConfigVersion[]> | ConfigVersion[];

    /**
     * Returns new, unique incremented version number
     * @param store
     */
    getNewVersionLabel(store: ConfigStore): Promise<number> | number;
};