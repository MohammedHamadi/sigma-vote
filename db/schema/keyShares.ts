import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
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
  shareX: text("share_x").notNull(), // share index
  shareY: text("share_y").notNull(), // share value (encrypted)
  submitted: boolean("submitted").default(false), // has admin submitted for tallying?
});
