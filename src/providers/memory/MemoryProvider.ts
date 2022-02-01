import { ConfigProvider, ServiceConfiguration, ConfigProviderError } from '../ConfigProvider';
import { v4 } from 'uuid';

export default class MemoryProvider implements ConfigProvider {

    private configs: ServiceConfiguration[];

    constructor() {
        this.configs = [];
    }

    private findConfigIndex(name: string) {
        return this.configs.findIndex(c => c.name === name);
    }

    addConfig(name: string, config: any): Promise<string> {
        const configIndex = this.findConfigIndex(name);
        if (configIndex !== -1) {
            throw new Error('Configuration already exists!');
        }

        const id = v4();
        this.configs.push({
            id,
            name,
            config
        });

        return Promise.resolve(id);
    }

    getConfig(name: string): Promise<ServiceConfiguration> {
        const configIndex = this.findConfigIndex(name);
        if (configIndex === -1) {
            throw new Error('Configuration not found!');
        }
        return Promise.resolve(this.configs[configIndex]);
    }

    removeConfig(name: string): Promise<void> {
        const configIndex = this.findConfigIndex(name);
        if (configIndex === -1) {
            throw new Error('Configuration not found!');
        }
        this.configs = this.configs.filter(c => c.name !== name);

        return Promise.resolve();
    }

}