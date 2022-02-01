export interface ServiceConfiguration {
    id: string;
    name: string;
    config: Object;
};

export class ConfigProviderError extends Error { }

export abstract class ConfigProvider {
    abstract addConfig(name: string, config: any): Promise<string>;
    abstract getConfig(name: string): Promise<ServiceConfiguration>;
    abstract removeConfig(name: string): Promise<void>;
};