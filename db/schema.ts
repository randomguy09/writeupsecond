import { pgTable, serial, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export const writeups = pgTable(
  "writeups",
  {
    id: serial().primaryKey(),
    userId: text("user_id").notNull(),
    ctfName: text("ctf_name").notNull(),
    challengeName: text("challenge_name").notNull(),
    category: text().notNull(),
    difficulty: text().notNull(),
    summary: text().notNull().default(""),
    contentHTML: text("content_html").notNull().default(""),
    contentJSON: jsonb("content_json"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("writeups_user_created_idx").on(t.userId, t.createdAt)]
);
