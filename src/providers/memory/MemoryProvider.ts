import { Config, ConfigProvider, ConfigProviderError, ConfigStore, ConfigVersion, StoreKeys } from '../ConfigProvider';
import { v4 } from 'uuid';
import { signStore, validateKey } from '../../util/jwt';

export default class MemoryProvider implements ConfigProvider {

    private stores: ConfigStore[];

    constructor() {
        this.stores = [];
    }

    init(): Promise<void> {
        return Promise.resolve();
    }

    createStore(name: string): Promise<StoreKeys> {
        const id = v4();

        this.stores.push({
            id,
            name,
            configurations: [],
            liveVersion: undefined,
        });

        return Promise.resolve(signStore(id, name));
    }

    removeStore(accessKey: string): Promise<void> {
        const { id } = validateKey(accessKey);
        if (!this.stores.map(s => s.id).includes(id)) {
            throw new ConfigProviderError('Store not found!', 404);
        }
        this.stores = this.stores.filter(store => store.id !== id);
        return Promise.resolve();
    }

    getNewVersionLabel(store: ConfigStore): Promise<number> {
        const ids = store.configurations.map(c => c.version.id);
        return Promise.resolve(ids.length === 0 ? 1 : (Math.max(...ids) + 1));
    }

    private getStoreByAccessKey(accessKey: string) {
        const { id } = validateKey(accessKey);
        const storeIndex = this.stores.findIndex(store => store.id === id);
        if (storeIndex === -1) {
            throw new ConfigProviderError('Invalid accessKey!', 401);
        }
        return this.stores[storeIndex];
    }

    restoreStore(restoreKey: string): Promise<StoreKeys> {
        const { id } = validateKey(restoreKey);
        const storeIndex = this.stores.findIndex(store => store.id === id);
        if (storeIndex === -1) {
            throw new ConfigProviderError('Invalid restoreKey!', 401);
        }
        const store = this.stores[storeIndex];
        const keys = signStore(store.id, store.name);
        return Promise.resolve(keys);
    }

    async addConfig(accessKey: string, config: Object): Promise<string> {
        validateKey(accessKey);
        const id = v4();
        const store = this.getStoreByAccessKey(accessKey);
        const versionId = await this.getNewVersionLabel(store);

        store.configurations.push({
            id,
            version: {
                id: versionId,
                createdAt: Date.now(),
                live: false
            },
            config
        });

        return Promise.resolve(id);
    }

    publishConfig(accessKey: string, version: number): Promise<void> {
        const store = this.getStoreByAccessKey(accessKey);

        store.configurations = store.configurations.map(config => {
            config.version.live = false;
            return config;
        });

        if (store.liveVersion !== undefined && !store.configurations.map(config => config.version.id).includes(version)) {
            throw new ConfigProviderError('Invalid version number!', 400);
        }

        store.liveVersion = version;
        store.configurations.find(config => config.version.id === version).version.live = true;
        return Promise.resolve();
    }

    unpublishConfig(accessKey: string, version: number): Promise<void> {
        const store = this.getStoreByAccessKey(accessKey);

        if (store.liveVersion !== undefined && !store.configurations.map(config => config.version.id).includes(version)) {
            throw new ConfigProviderError('Invalid version number!', 400);
        }

        store.liveVersion = undefined;
        store.configurations.find(config => config.version.id === version).version.live = false;
        return Promise.resolve();
    }

    getConfig(accessKey: string): Promise<Config> {
        const store = this.getStoreByAccessKey(accessKey);
        const config = store.configurations.find(config => config.version.id === store.liveVersion);
        if (config === undefined) {
            throw new ConfigProviderError('No published configuration!', 400);
        }
        return Promise.resolve(config);
    }

    removeConfig(accessKey: string, version: number): Promise<void> {
        const store = this.getStoreByAccessKey(accessKey);

        if (!store.configurations.map(config => config.version.id).includes(version)) {
            throw new ConfigProviderError('Invalid version number!', 400);
        }

        if (store.liveVersion === version) {
            throw new ConfigProviderError('Cannot remove live configuration!', 400);
        }

        store.configurations = store.configurations.filter(config => config.version.id !== version);
        return Promise.resolve();
    }

    getVersions(accessKey: string): Promise<ConfigVersion[]> {
        const store = this.getStoreByAccessKey(accessKey);
        return Promise.resolve(store.configurations.map(config => config.version));
    }
}