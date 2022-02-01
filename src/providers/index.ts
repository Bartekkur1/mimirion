import { ConfigProvider } from "./ConfigProvider";
import MemoryProvider from "./memory/MemoryProvider";

export type ProviderList = { [name: string]: typeof ConfigProvider };

export const providers: ProviderList = {
    'memory': MemoryProvider
};