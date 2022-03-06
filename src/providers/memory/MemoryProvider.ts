import { Config, ConfigProvider, ConfigProviderError, ConfigStore, ConfigVersion, StoreDetails, StoreKeys } from '../ConfigProvider';
import { v4 } from 'uuid';
import { signStore } from '../../util/jwt';

export default class MemoryProvider implements ConfigProvider {

    private stores: ConfigStore[];

    constructor() {
        this.stores = [];
    }

    init(): Promise<void> {
        return Promise.resolve();
    }

    createStore(name: string): StoreKeys {
        const id = v4();

        this.stores.push({
            id,
            name,
            configurations: [],
            liveVersion: undefined,
            createdAt: Date.now()
        });

        return signStore(id, name);
    }

    removeStore(id: string): void {
        if (!this.stores.map(s => s.id).includes(id)) {
            throw new ConfigProviderError('Store not found!', 404);
        }
        this.stores = this.stores.filter(store => store.id !== id);
    }

    getStores(): StoreDetails[] {
        return this.stores.map(({ id, liveVersion, name, createdAt }) => ({
            id, liveVersion, name, createdAt
        }));
    }

    getNewVersionLabel(store: ConfigStore): number {
        const ids = store.configurations.map(c => c.version.id);
        return ids.length === 0 ? 1 : (Math.max(...ids) + 1);
    }

    private getStoreByStoreId(id: string) {
        const storeIndex = this.stores.findIndex(store => store.id === id);
        if (storeIndex === -1) {
            throw new ConfigProviderError('Invalid storeId!', 401);
        }
        return this.stores[storeIndex];
    }

    restoreStore(id: string): StoreKeys {
        const storeIndex = this.stores.findIndex(store => store.id === id);
        if (storeIndex === -1) {
            throw new ConfigProviderError('Invalid restoreKey!', 401);
        }
        const store = this.stores[storeIndex];
        return signStore(store.id, store.name);
    }

    addConfig(storeId: string, config: Object) {
        const id = v4();
        const store = this.getStoreByStoreId(storeId);
        const versionId = this.getNewVersionLabel(store);

        store.configurations.push({
            id,
            version: {
                id: versionId,
                createdAt: Date.now(),
                live: false
            },
            config
        });

        return id;
    }

    publishConfig(storeId: string, version: number): void {
        const store = this.getStoreByStoreId(storeId);

        store.configurations = store.configurations.map(config => {
            config.version.live = false;
            return config;
        });

        const versions = store.configurations.map(config => config.version.id) || [];
        if (!versions.includes(version)) {
            throw new ConfigProviderError('Invalid version number!', 400);
        }

        store.liveVersion = version;
        const liveConfig = store.configurations.find(config => config.version.id === version);
        if (liveConfig !== undefined) {
            liveConfig.version.live = true;
        }
    }

    unpublishConfig(storeId: string, version: number): void {
        const store = this.getStoreByStoreId(storeId);

        if (store.liveVersion !== undefined && !store.configurations.map(config => config.version.id).includes(version)) {
            throw new ConfigProviderError('Invalid version number!', 400);
        }

        store.liveVersion = undefined;
        store.configurations.find(config => config.version.id === version).version.live = false;
    }

    getConfig(storeId: string): Config {
        const store = this.getStoreByStoreId(storeId);
        const config = store.configurations.find(config => config.version.id === store.liveVersion);
        if (config === undefined) {
            throw new ConfigProviderError('No published configuration!', 400);
        }
        return config;
    }

    removeConfig(storeId: string, version: number): void {
        const store = this.getStoreByStoreId(storeId);

        if (!store.configurations.map(config => config.version.id).includes(version)) {
            throw new ConfigProviderError('Invalid version number!', 400);
        }

        if (store.liveVersion === version) {
            throw new ConfigProviderError('Cannot remove live configuration!', 400);
        }

        store.configurations = store.configurations.filter(config => config.version.id !== version);
    }

    getVersions(storeId: string): ConfigVersion[] {
        return this.getStoreByStoreId(storeId).configurations.map(config => config.version);
    }
}