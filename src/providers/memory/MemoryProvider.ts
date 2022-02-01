import { ConfigProvider, ServiceConfiguration, ConfigProviderError } from '../ConfigProvider';
import { v4 } from 'uuid';

export default class MemoryProvider implements ConfigProvider {

    private configs: ServiceConfiguration[];

    constructor() {
        this.configs = [];
    }

    getName() {
        return 'memory';
    }

    private isNameTaken(name: string, userId: string): boolean {
        return this.configs.findIndex(c => c.name === name && c.userId === userId) !== -1;
    }

    private assertConfigExists(userId: string, name: string) {
        const configIndex = this.configs.findIndex(c => c.name === name && c.userId === userId);
        if (configIndex === -1) {
            throw new ConfigProviderError('Configuration not found!');
        }

        return configIndex;
    }

    addConfig(userId: string, name: string, config: any): Promise<string> {
        if (this.isNameTaken(name, userId)) {
            throw new ConfigProviderError('Configuration name is already taken!');
        }

        const id = v4();
        this.configs.push({
            id,
            userId,
            name,
            config
        });

        return Promise.resolve(id);
    }

    getConfig(userId: string, name: string): Promise<ServiceConfiguration> {
        const configIndex = this.assertConfigExists(userId, name);
        return Promise.resolve(this.configs[configIndex]);
    }

    removeConfig(userId: string, name: string): Promise<void> {
        const configIndex = this.assertConfigExists(userId, name);
        const { id } = this.configs[configIndex];
        this.configs = this.configs.filter(c => c.id !== id);
        return Promise.resolve();
    }


}