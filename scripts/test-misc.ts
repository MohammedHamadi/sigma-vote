/**
 * Misc unit tests for non-crypto helpers and key invariants we just fixed.
 *
 * Run with:  npx tsx scripts/test-misc.ts
 */
import { validateElectionWindow } from "../lib/db-utils";

let failed = 0;
function assertEq(actual: unknown, expected: unknown, label: string) {
  const ok = actual === expected;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: got=${actual} expected=${expected}`);
  if (!ok) failed++;
}

// ── validateElectionWindow ───────────────────────────────────────────────
const now = new Date();
const past = new Date(now.getTime() - 60_000);
const future = new Date(now.getTime() + 60_000);

assertEq(
  validateElectionWindow({ status: "OPEN", startTime: past, endTime: future }),
  true,
  "OPEN within window -> true",
);
assertEq(
  validateElectionWindow({ status: "OPEN", startTime: future, endTime: future }),
  false,
  "OPEN before startTime -> false",
);
assertEq(
  validateElectionWindow({ status: "OPEN", startTime: past, endTime: past }),
  false,
  "OPEN after endTime -> false",
);
assertEq(
  validateElectionWindow({ status: "OPEN", startTime: null, endTime: null }),
  true,
  "OPEN with no window bounds -> true",
);
assertEq(
  validateElectionWindow({ status: "SETUP", startTime: past, endTime: future }),
  false,
  "SETUP within times but wrong status -> false",
);
assertEq(
  validateElectionWindow({ status: "CLOSED", startTime: past, endTime: future }),
  false,
  "CLOSED -> false",
);
assertEq(
  validateElectionWindow({ status: null, startTime: null, endTime: null }),
  false,
  "null status -> false",
);

if (failed) {
  console.log(`\n== ${failed} test(s) FAILED ==`);
  process.exit(1);
} else {
  console.log("\n== ALL MISC TESTS PASSED ==");
}
