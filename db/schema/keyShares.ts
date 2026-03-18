import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { elections } from "./elections";

export const keyShares = pgTable("key_shares", {
  id: uuid("id").defaultRandom().primaryKey(),
  electionId: uuid("election_id")
    .notNull()
    .references(() => elections.id, { onDelete: "cascade" }),
  shareIndex: integer("share_index").notNull(),
  shareData: text("share_data").notNull(), // Encrypted Shamir share
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});
