import { ProviderTests } from "./ProviderTests";
import { providers } from '../src/providers';

const implementations = Object.keys(providers).map(key => providers[key]);

for (let provider of implementations) {
    describe(provider.name, () => {
        const tests = new ProviderTests(new provider());

        it('normal_usage_scenario', () => tests.normal_usage_scenario());
        it('should_return_new_published_config', () => tests.should_return_new_published_config());
        it('should_remove_proper_versions', () => tests.should_remove_proper_versions());
        it('should_fail_to_get_config_from_removed_store', () => tests.should_fail_to_get_config_from_removed_store());
        it('should_fail_to_remove_live_version', () => tests.should_fail_to_remove_live_version());
        it('should_unpublish_config', () => tests.should_unpublish_config());
        it('should_fail_to_remove_store_that_doesnt_exists', () => tests.should_fail_to_remove_store_that_doesnt_exists());

    });
};