import { BigQuery } from '@google-cloud/bigquery';

let bq: BigQuery | null = null;

export function getBQ(): BigQuery {
  if (bq) return bq;

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    bq = new BigQuery({
      projectId: credentials.project_id,
      credentials,
    });
  } else {
    bq = new BigQuery({
      projectId: process.env.GCP_PROJECT_ID || 'ecel-client',
    });
  }

  return bq;
}

export const PROJECT_ID = process.env.GCP_PROJECT_ID || 'ecel-client';
export const DATASET_IG = 'instagram_analytics';
export const DATASET_ADS = 'meta_ads';
export const DATASET_MASTER = 'master';

// Helpers
export function table(dataset: string, name: string): string {
  return `\`${PROJECT_ID}.${dataset}.${name}\``;
}

export async function queryRows<T = Record<string, unknown>>(
  sql: string,
  params?: Record<string, unknown>
): Promise<T[]> {
  const [rows] = await getBQ().query({ query: sql, params });
  return rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: Record<string, unknown>
): Promise<T | undefined> {
  const rows = await queryRows<T>(sql, params);
  return rows[0];
}

export async function runDML(
  sql: string,
  params?: Record<string, unknown>
): Promise<void> {
  await getBQ().query({ query: sql, params });
}

// Migration: ensure all required columns exist in the clients table
let migrationDone = false;
export async function ensureClientColumns(): Promise<void> {
  if (migrationDone) return;
  const T = table(DATASET_MASTER, 'clients');
  const columns = [
    { name: 'slug', type: 'STRING' },
  ];
  for (const col of columns) {
    try {
      await getBQ().query({ query: `ALTER TABLE ${T} ADD COLUMN ${col.name} ${col.type}` });
      console.log(`Added column ${col.name} to clients table`);
    } catch {
      // Column already exists - ignore
    }
  }
  migrationDone = true;
}
