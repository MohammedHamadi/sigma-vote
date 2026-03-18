import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const elections = pgTable("elections", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("DRAFT").notNull(),
  // status: DRAFT | OPEN | CLOSED | TALLIED
  publicKey: text("public_key"), // Paillier public key (JSON)
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
