// db/index.ts

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);

// Ensure you have 'export const db' (Named Export)
export const db = drizzle(sql, { schema });