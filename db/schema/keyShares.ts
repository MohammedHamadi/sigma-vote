import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { elections } from "./elections";
import { voters } from "./voters";

export const keyShares = pgTable("key_shares", {
  id: serial("id").primaryKey(),
  electionId: integer("election_id")
    .notNull()
    .references(() => elections.id),
  adminId: integer("admin_id")
    .notNull()
    .references(() => voters.id),
  shareX: integer("share_x").notNull(),
  shareCommitment: text("share_commitment").notNull(),
  submitted: boolean("submitted").notNull().default(false),
  submittedValue: text("submitted_value"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
