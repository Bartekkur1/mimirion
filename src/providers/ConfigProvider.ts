export interface ServiceConfiguration {
    id: string;
    name: string;
    userId: string;
    config: Object;
};

export class ConfigProviderError extends Error { }

export abstract class ConfigProvider {
    abstract getName(): string;
    abstract addConfig(userId: string, name: string, config: any): Promise<string>;
    abstract getConfig(userId: string, name: string): Promise<ServiceConfiguration>;
    abstract removeConfig(userId: string, name: string): Promise<void>;
};