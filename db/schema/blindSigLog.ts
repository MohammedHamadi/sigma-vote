import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { elections } from "./elections";
import { voters } from "./voters";

export const blindSigLog = pgTable("blind_sig_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  electionId: uuid("election_id")
    .notNull()
    .references(() => elections.id, { onDelete: "cascade" }),
  voterId: uuid("voter_id")
    .notNull()
    .references(() => voters.id, { onDelete: "cascade" }),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
});
