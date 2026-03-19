CREATE TABLE "ballots" (
	"id" serial PRIMARY KEY NOT NULL,
	"election_id" integer NOT NULL,
	"ballot_token" text NOT NULL,
	"ciphertexts" text NOT NULL,
	"proofs" text NOT NULL,
	"submitted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blind_sig_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"election_id" integer NOT NULL,
	"voter_id" integer NOT NULL,
	"issued_at" timestamp DEFAULT now(),
	CONSTRAINT "blind_sig_log_election_voter_unique" UNIQUE("election_id","voter_id")
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" serial PRIMARY KEY NOT NULL,
	"election_id" integer NOT NULL,
	"name" text NOT NULL,
	"party" text,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "elections" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'SETUP',
	"paillier_pub_n" text NOT NULL,
	"paillier_pub_g" text NOT NULL,
	"rsa_pub_e" text NOT NULL,
	"rsa_pub_n" text NOT NULL,
	"threshold" integer NOT NULL,
	"total_shares" integer NOT NULL,
	"start_time" timestamp,
	"end_time" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "key_shares" (
	"id" serial PRIMARY KEY NOT NULL,
	"election_id" integer NOT NULL,
	"admin_id" integer NOT NULL,
	"share_x" text NOT NULL,
	"share_y" text NOT NULL,
	"submitted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "used_tokens" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"election_id" integer NOT NULL,
	"used_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "voters" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'voter',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "voters_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ballots" ADD CONSTRAINT "ballots_election_id_elections_id_fk" FOREIGN KEY ("election_id") REFERENCES "public"."elections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blind_sig_log" ADD CONSTRAINT "blind_sig_log_election_id_elections_id_fk" FOREIGN KEY ("election_id") REFERENCES "public"."elections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blind_sig_log" ADD CONSTRAINT "blind_sig_log_voter_id_voters_id_fk" FOREIGN KEY ("voter_id") REFERENCES "public"."voters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_election_id_elections_id_fk" FOREIGN KEY ("election_id") REFERENCES "public"."elections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "key_shares" ADD CONSTRAINT "key_shares_election_id_elections_id_fk" FOREIGN KEY ("election_id") REFERENCES "public"."elections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "key_shares" ADD CONSTRAINT "key_shares_admin_id_voters_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."voters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "used_tokens" ADD CONSTRAINT "used_tokens_election_id_elections_id_fk" FOREIGN KEY ("election_id") REFERENCES "public"."elections"("id") ON DELETE no action ON UPDATE no action;