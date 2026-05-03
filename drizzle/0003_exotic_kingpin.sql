CREATE TABLE "election_voters" (
	"id" serial PRIMARY KEY NOT NULL,
	"election_id" integer NOT NULL,
	"voter_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "election_voters" ADD CONSTRAINT "election_voters_election_id_elections_id_fk" FOREIGN KEY ("election_id") REFERENCES "public"."elections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "election_voters" ADD CONSTRAINT "election_voters_voter_id_voters_id_fk" FOREIGN KEY ("voter_id") REFERENCES "public"."voters"("id") ON DELETE cascade ON UPDATE no action;