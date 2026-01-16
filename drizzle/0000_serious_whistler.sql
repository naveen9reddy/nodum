CREATE TABLE "requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"provider" varchar(50),
	"model" varchar(100),
	"prompt" text,
	"response" text,
	"tokens_used" integer,
	"cost" numeric(10, 6),
	"latency_ms" integer,
	"status" varchar(20),
	"error" text,
	"user_id" varchar(100)
);
--> statement-breakpoint
CREATE INDEX "idx_timestamp" ON "requests" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_user_id" ON "requests" USING btree ("user_id");