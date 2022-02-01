import { v4 } from "uuid";
import { ConfigProvider } from "../providers/ConfigProvider";

const TestConfiguration = {
    test: 123,
    database: {
        host: 'localhost',
        port: 8000
    }
};

export class ProviderTests<T extends ConfigProvider> {

    private provider: T;
    private serviceName: string;

    constructor(provider: T) {
        this.serviceName = 'mimirion';
        this.provider = provider;
    }

    private async basic_adding_new_configuration() {
        const configId = await this.provider.addConfig(this.serviceName, TestConfiguration);
        expect(configId).not.toBeUndefined();
        expect(typeof configId).toBe('string');
    }

    private async basic_get_configuration() {
        const { config, name } = await this.provider.getConfig(this.serviceName);
        expect(name).toBe(this.serviceName);
        expect(config).toBe(TestConfiguration);
    }

    private async basic_configuration_delete() {
        await this.provider.removeConfig(this.serviceName);
        let error = undefined;
        try {
            await this.provider.getConfig(this.serviceName);
        } catch (err) {
            error = err;
        }

        expect(error).not.toBeUndefined();
    }

    public async run() {
        await this.basic_adding_new_configuration();
        await this.basic_get_configuration();
        await this.basic_configuration_delete();
    }

}