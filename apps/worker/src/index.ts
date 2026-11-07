import { BRAND } from '@compras-ja/shared';

/**
 * Worker Compras Já — BullMQ.
 * Em development, sobe sem Redis obrigatório (modo dry-run).
 * Jobs reais: sync PNCP consulta, e-mail, outbox, alertas documentais.
 */
async function main() {
  const redisUrl = process.env.REDIS_URL;
  // eslint-disable-next-line no-console
  console.log(`[${BRAND.name}] worker starting...`);

  if (!redisUrl) {
    // eslint-disable-next-line no-console
    console.warn('REDIS_URL ausente — worker em modo dry-run (sem filas).');
    setInterval(() => {
      // heartbeat
    }, 60_000);
    return;
  }

  const { Queue, Worker } = await import('bullmq');
  const IORedis = (await import('ioredis')).default;
  const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

  const outboxQueue = new Queue('outbox', { connection });
  await outboxQueue.add(
    'heartbeat',
    { at: new Date().toISOString() },
    { repeat: { every: 60_000 }, removeOnComplete: 10 },
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const worker = new Worker(
    'outbox',
    async (job) => {
      // eslint-disable-next-line no-console
      console.log(`[worker] job ${job.name}`, job.data);
    },
    { connection },
  );

  // eslint-disable-next-line no-console
  console.log(`[${BRAND.name}] worker connected to Redis`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
