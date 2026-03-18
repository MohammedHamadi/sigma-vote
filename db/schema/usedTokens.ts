import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { elections } from "./elections";

export const usedTokens = pgTable("used_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  electionId: uuid("election_id")
    .notNull()
    .references(() => elections.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  usedAt: timestamp("used_at").defaultNow().notNull(),
});
