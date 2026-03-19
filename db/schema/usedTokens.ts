import {
  pgTable,
  text,
  integer,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { elections } from "./elections";

// token_hash is the PK — prevents double-voting
export const usedTokens = pgTable("used_tokens", {
  tokenHash: text("token_hash").primaryKey(), // hash of token (not raw token)
  electionId: integer("election_id")
    .notNull()
    .references(() => elections.id),
  usedAt: timestamp("used_at").defaultNow(),
});
