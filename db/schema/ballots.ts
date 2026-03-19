import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { elections } from "./elections";

// IMPORTANT: No voter_id reference — this is the core anonymity guarantee.
// Submitted ballots cannot be linked back to any voter identity.
export const ballots = pgTable("ballots", {
  id: serial("id").primaryKey(),
  electionId: integer("election_id")
    .notNull()
    .references(() => elections.id),
  ballotToken: text("ballot_token").notNull(), // the anonymous token T
  ciphertexts: text("ciphertexts").notNull(), // JSON array of encrypted votes per candidate
  proofs: text("proofs").notNull(), // JSON array of ZKPs
  submittedAt: timestamp("submitted_at").defaultNow(),
});
