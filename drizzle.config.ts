import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // This tells Drizzle we are using Postgres (Neon)
  dialect: 'postgresql', 
  
  // Path to your schema file (no /src since you don't have one)
  schema: './db/schema.ts', 
  
  // Where Drizzle will store migration history
  out: './drizzle',
  
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  
  // Highly recommended for safety
  strict: true,
  verbose: true,
});