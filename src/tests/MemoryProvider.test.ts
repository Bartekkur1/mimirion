import MemoryProvider from "../providers/memory/MemoryProvider";
import { ProviderTests } from "./ProviderTests";

test('MemoryProvider', async () => {

    const providerInstance = new MemoryProvider();
    const providerTest = new ProviderTests<MemoryProvider>(providerInstance);
    await providerTest.run();

});