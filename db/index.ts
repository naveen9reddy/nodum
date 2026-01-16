// lib/db/index.ts

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (db) return db;

  const connectionString = process.env.DATABASE_URL;

  console.log(
    "DATABASE_URL present:",
    Boolean(process.env.DATABASE_URL)
  );
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(connectionString);
  db = drizzle(sql, { schema });

  return db;
}
