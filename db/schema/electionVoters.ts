import {
  pgTable,
  serial,
  integer,
} from "drizzle-orm/pg-core";
import { elections } from "./elections";
import { voters } from "./voters";

export const electionVoters = pgTable("election_voters", {
  id: serial("id").primaryKey(),
  electionId: integer("election_id")
    .notNull()
    .references(() => elections.id, { onDelete: "cascade" }),
  voterId: integer("voter_id")
    .notNull()
    .references(() => voters.id, { onDelete: "cascade" }),
});
