import {
  pgTable,
  serial,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { elections } from "./elections";

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  electionId: integer("election_id")
    .notNull()
    .references(() => elections.id),
  name: text("name").notNull(),
  party: text("party"),
  position: integer("position").notNull(), // order index (0, 1, 2, ...)
});
