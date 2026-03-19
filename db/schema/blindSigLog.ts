import {
  pgTable,
  serial,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { elections } from "./elections";
import { voters } from "./voters";

// Tracks who got a signature, NOT what they voted
export const blindSigLog = pgTable(
  "blind_sig_log",
  {
    id: serial("id").primaryKey(),
    electionId: integer("election_id")
      .notNull()
      .references(() => elections.id),
    voterId: integer("voter_id")
      .notNull()
      .references(() => voters.id),
    issuedAt: timestamp("issued_at").defaultNow(),
  },
  (table) => [
    unique("blind_sig_log_election_voter_unique").on(
      table.electionId,
      table.voterId
    ), // one signature per voter per election
  ]
);
