import { loadConfig } from './config.ts';
import { buildApp } from './app.ts';
import { makeProviders, makeStore } from './wiring.ts';

const config = loadConfig();
const { providers, geocoder, photos } = makeProviders(config);
const store = await makeStore(config);
const app = await buildApp({ config, providers, geocoder, store, photos, logger: true });

const shutdown = async () => {
  await app.close();
  await store.close();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

await app.listen({ port: config.PORT, host: config.HOST });
app.log.info(`router=${providers.router.name} store=${config.DATABASE_URL ? 'postgres' : 'memory'}`);
