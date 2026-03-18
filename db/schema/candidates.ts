import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { elections } from "./elections";

export const candidates = pgTable("candidates", {
  id: uuid("id").defaultRandom().primaryKey(),
  electionId: uuid("election_id")
    .notNull()
    .references(() => elections.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
});
