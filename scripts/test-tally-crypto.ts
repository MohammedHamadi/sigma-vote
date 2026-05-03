/**
 * End-to-end test of the tally cryptographic pipeline.
 *
 * Reproduces what features/admin/actions.ts::tally does:
 *   1. Generate Paillier keypair, RSA-blind keypair (skipped here).
 *   2. Shamir-split lambda into n shares with threshold t.
 *   3. Encrypt synthetic ballots (one-hot per candidate).
 *   4. Homomorphically aggregate per candidate.
 *   5. Reconstruct lambda from t random shares.
 *   6. Recompute mu = (L(g^lambda mod n^2))^-1 mod n.
 *   7. Decrypt aggregates and check totals match the plaintext truth.
 *
 * Run with:  npx tsx scripts/test-tally-crypto.ts
 */
import {
  generatePaillierKeypair,
  paillierEncrypt,
  paillierDecrypt,
  homomorphicAdd,
} from "../lib/crypto/paillier";
import { splitSecret, reconstructSecret } from "../lib/crypto/shamir";
import { modPow, modInverse } from "../lib/crypto/bigint-utils";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function assertEq(actual: unknown, expected: unknown, label: string) {
  const ok = actual === expected;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: got=${actual} expected=${expected}`);
  if (!ok) process.exitCode = 1;
}

async function main() {
  console.log("== Generating Paillier keypair (2048-bit, this takes ~5-30s)...");
  const t0 = Date.now();
  const kp = generatePaillierKeypair();
  console.log(`   keypair generated in ${Date.now() - t0}ms`);

  const n = BigInt(kp.publicKey.n);
  const g = BigInt(kp.publicKey.g);
  const n2 = n * n;
  const trueLambda = BigInt(kp.privateKey.lambda);
  const trueMu = BigInt(kp.privateKey.mu);

  // ── 1. Shamir split lambda ──────────────────────────────────────────────
  const N_SHARES = 5;
  const THRESHOLD = 3;
  console.log(`== Splitting lambda into ${N_SHARES} shares, threshold ${THRESHOLD}`);
  const shares = splitSecret(trueLambda, N_SHARES, THRESHOLD);

  // ── 2. Reconstruct lambda from THRESHOLD random shares ─────────────────
  const subset = shuffle(shares).slice(0, THRESHOLD);
  const reconstructedLambda = reconstructSecret(subset);
  assertEq(
    reconstructedLambda === trueLambda,
    true,
    "reconstructed lambda equals true lambda",
  );

  // ── 3. Derive mu from reconstructed lambda ──────────────────────────────
  const lOfGLambda = (modPow(g, reconstructedLambda, n2) - 1n) / n;
  const reconstructedMu = modInverse(lOfGLambda, n);
  assertEq(
    reconstructedMu === trueMu,
    true,
    "derived mu equals stored mu",
  );

  // ── 4. Encrypt a small election ─────────────────────────────────────────
  const NUM_CANDIDATES = 3;
  const BALLOTS = [
    [1, 0, 0],
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, 1],
    [1, 0, 0],
    [0, 1, 0],
  ];
  const expectedTotals = BALLOTS.reduce(
    (acc, b) => acc.map((v, i) => v + b[i]),
    new Array(NUM_CANDIDATES).fill(0) as number[],
  );
  console.log(`== Encrypting ${BALLOTS.length} ballots over ${NUM_CANDIDATES} candidates`);
  console.log(`   expected per-candidate totals: ${expectedTotals.join(", ")}`);

  const cipherBallots: bigint[][] = BALLOTS.map((ballot) =>
    ballot.map((v) => paillierEncrypt(BigInt(v), kp.publicKey)),
  );

  // ── 5. Homomorphic aggregation per candidate ────────────────────────────
  const aggregates: bigint[] = new Array(NUM_CANDIDATES).fill(0n).map((_, i) => {
    let acc = cipherBallots[0][i];
    for (let b = 1; b < cipherBallots.length; b++) {
      acc = homomorphicAdd(acc, cipherBallots[b][i], kp.publicKey);
    }
    return acc;
  });

  // ── 6. Decrypt with reconstructed (lambda, mu) ─────────────────────────
  const reconstructedPrivateKey = {
    lambda: reconstructedLambda.toString(),
    mu: reconstructedMu.toString(),
    n: kp.publicKey.n,
  };

  const decrypted = aggregates.map((c) =>
    Number(paillierDecrypt(c, reconstructedPrivateKey)),
  );
  console.log(`   decrypted totals (reconstructed key): ${decrypted.join(", ")}`);

  for (let i = 0; i < NUM_CANDIDATES; i++) {
    assertEq(decrypted[i], expectedTotals[i], `candidate ${i} total`);
  }

  // ── 7. Negative control: bogus mu ("0") yields wrong answers ───────────
  const bogus = aggregates.map((c) =>
    Number(
      paillierDecrypt(c, {
        lambda: reconstructedLambda.toString(),
        mu: "0",
        n: kp.publicKey.n,
      }),
    ),
  );
  console.log(`   sanity (mu=0 placeholder, should NOT match): ${bogus.join(", ")}`);
  const allZero = bogus.every((v) => v === 0);
  assertEq(allZero, true, "mu=0 placeholder produces all-zero (confirms previous bug)");

  // ── 8. Submit-share simulation: only THRESHOLD shares are enough ───────
  const tooFew = shuffle(shares).slice(0, THRESHOLD - 1);
  let badReconWorked = false;
  try {
    const recon = reconstructSecret(tooFew);
    badReconWorked = recon === trueLambda;
  } catch {
    badReconWorked = false;
  }
  assertEq(
    badReconWorked,
    false,
    "fewer than THRESHOLD shares cannot reconstruct lambda",
  );

  console.log(
    process.exitCode === 1
      ? "\n== SOME TESTS FAILED =="
      : "\n== ALL TESTS PASSED ==",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
