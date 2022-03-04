import { ConfigProvider, StoreKeys } from "../src/providers/ConfigProvider";

const TestConfiguration = {
    test: 123,
    database: {
        host: 'localhost',
        port: 8000
    }
};

export class ProviderTests<T extends ConfigProvider> {

    private provider: T;
    private testStoreName = 'testStore1';
    private keys: StoreKeys;

    constructor(provider: T) {
        this.provider = provider;
    }

    private async create_store() {
        this.keys = await this.provider.createStore(this.testStoreName);
        const { accessKey, restoreKey } = this.keys;
        expect(typeof accessKey).toBe('string');
        expect(typeof restoreKey).toBe('string');
    }

    private async add_config() {
        const configId = await this.provider.addConfig(this.keys.accessKey, TestConfiguration);
        expect(typeof configId).toBe('string');
    }

    private async publish_new_version(version) {
        await this.provider.publishConfig(this.keys.accessKey, version);
    }

    private async get_published_config(versionId) {
        const { config, version } = await this.provider.getConfig(this.keys.accessKey);
        expect(config).toBe(TestConfiguration);
        expect(version.id).toBe(versionId);
    }

    private async get_config_expect_error(version) {
        await expect(this.get_published_config(version)).rejects.toThrow();
    }

    private async remove_config(version) {
        await this.provider.removeConfig(this.keys.accessKey, version);
    }

    private async remove_store() {
        await this.provider.removeStore(this.keys.accessKey);
    }

    private async get_versions(expectedVersion: number[]) {
        const versions = await this.provider.getVersions(this.keys.accessKey);
        const ids = versions.map(v => v.id);
        expectedVersion.forEach(v => expect(ids).toContain(v));
    }

    private async remove_config_expect_error(version) {
        await expect(this.remove_config(version)).rejects.toThrow();
    }

    private async remove_store_expect_error() {
        await expect(this.remove_store()).rejects.toThrow();
    }

    private async unpublish_version(version) {
        await this.provider.unpublishConfig(this.keys.accessKey, version);
    }

    // tests

    public async normal_usage_scenario() {
        await this.create_store();
        await this.add_config();
        await this.get_config_expect_error(1);
        await this.publish_new_version(1);
        await this.get_published_config(1);
    }

    public async should_return_new_published_config() {
        await this.add_config();
        await this.publish_new_version(2);
        await this.get_published_config(2);
    }

    public async should_remove_proper_versions() {
        await this.get_versions([1, 2]);
        await this.remove_config(1);
        await this.get_versions([2]);
        await this.remove_config_expect_error(2);
    }

    public async should_fail_to_get_config_from_removed_store() {
        await this.remove_store();
        await this.get_config_expect_error(2);
    }

    public async should_fail_to_remove_live_version() {
        await this.create_store();
        await this.add_config();
        await this.publish_new_version(1);
        await this.remove_config_expect_error(1);
        await this.remove_store();
    }

    public async should_unpublish_config() {
        await this.create_store();
        await this.add_config();
        await this.get_config_expect_error(1);
        await this.publish_new_version(1);
        await this.get_published_config(1);
        await this.unpublish_version(1);
        await this.get_config_expect_error(1);
        await this.remove_store();
    }

    public async should_fail_to_remove_store_that_doesnt_exists() {
        this.keys.accessKey = '';
        await this.remove_store_expect_error();
    }
}