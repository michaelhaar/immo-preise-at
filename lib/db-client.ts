import { Client, createClient } from '@libsql/client';

import { getRequiredEnvVar } from '@/lib/utils';

let dbClient: Client | null = null;

export function getDbClient(): Client {
  if (!dbClient) {
    dbClient = createClient({
      url: getRequiredEnvVar('TURSO_DB_URL'),
      authToken: getRequiredEnvVar('TURSO_DB_TOKEN'),
    });
  }

  return dbClient;
}
