import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const elections = pgTable("elections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("SETUP"), // SETUP | OPEN | CLOSED | TALLIED
  paillierPubN: text("paillier_pub_n").notNull(), // Paillier public key n (hex string)
  paillierPubG: text("paillier_pub_g").notNull(), // Paillier public key g (hex string)
  rsaPubE: text("rsa_pub_e").notNull(), // RSA e for blind signatures
  rsaPubN: text("rsa_pub_n").notNull(), // RSA n for blind signatures
  threshold: integer("threshold").notNull(), // t in (t,n) sharing
  totalShares: integer("total_shares").notNull(), // n in (t,n) sharing
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").defaultNow(),
});
