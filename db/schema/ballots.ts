import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { elections } from "./elections";

export const ballots = pgTable("ballots", {
  id: uuid("id").defaultRandom().primaryKey(),
  electionId: uuid("election_id")
    .notNull()
    .references(() => elections.id, { onDelete: "cascade" }),
  encryptedVote: text("encrypted_vote").notNull(), // JSON: Paillier ciphertexts per candidate
  proof: text("proof").notNull(), // JSON: ZKP proofs
  token: text("token").notNull(), // Blind-signed token
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});
