CREATE TABLE "writeups" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"ctf_name" text NOT NULL,
	"challenge_name" text NOT NULL,
	"category" text NOT NULL,
	"difficulty" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"content_html" text DEFAULT '' NOT NULL,
	"content_json" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "writeups_user_created_idx" ON "writeups" ("user_id","created_at");