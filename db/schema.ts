import {
    pgTable,
    serial,
    timestamp,
    varchar,
    text,
    integer,
    decimal,
    index,
  } from "drizzle-orm/pg-core";
  
  export const requests = pgTable(
    "requests",
    {
      id: serial("id").primaryKey(),
  
      timestamp: timestamp("timestamp").defaultNow().notNull(),
  
      provider: varchar("provider", { length: 50 }),
  
      model: varchar("model", { length: 100 }),
  
      prompt: text("prompt"),
  
      response: text("response"),
  
      tokensUsed: integer("tokens_used"),
  
      cost: decimal("cost", { precision: 10, scale: 6 }),
  
      latencyMs: integer("latency_ms"),
  
      status: varchar("status", { length: 20 }),
  
      error: text("error"),
  
      userId: varchar("user_id", { length: 100 }),
    },
    (table) => ({
      timestampIdx: index("idx_timestamp").on(table.timestamp),
      userIdIdx: index("idx_user_id").on(table.userId),
    })
  );
  