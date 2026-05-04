-- Custom migration: Secure Key Share Storage
-- Replaces plaintext share_y with cryptographic commitment (hash)
-- Adds submitted_value to store verified share at tally time

ALTER TABLE "key_shares" ADD COLUMN IF NOT EXISTS "share_commitment" text;
ALTER TABLE "key_shares" ADD COLUMN IF NOT EXISTS "submitted_value" text;

-- For existing rows, set a placeholder commitment (will need manual re-creation for real security)
UPDATE "key_shares" SET "share_commitment" = 'LEGACY' WHERE "share_commitment" IS NULL;

ALTER TABLE "key_shares" ALTER COLUMN "share_commitment" SET NOT NULL;

-- Drop the plaintext share_y column (irreversible - only do this after backing up if needed)
ALTER TABLE "key_shares" DROP COLUMN IF EXISTS "share_y";
