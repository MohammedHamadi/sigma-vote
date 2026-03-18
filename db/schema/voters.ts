import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const voters = pgTable("voters", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).default("voter"), // "voter" | "admin"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
