import { Mimirion } from './src/mimirion';
import MemoryProvider from './src/providers/memory/MemoryProvider';

(async () => {

    console.time('mimirion-start');
    const memoryProvider = new MemoryProvider();
    const mimirion = new Mimirion(memoryProvider);
    mimirion.run();
    console.timeEnd('mimirion-start');

})();