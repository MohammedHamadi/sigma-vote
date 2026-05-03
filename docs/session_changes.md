# SigmaVote — Session Changes Log

> **Date:** May 2026  
> **Session:** Admin Route Debug & Feature Completion  
> **Scope:** Bug fixes, cryptographic correctness, admin UX improvements, and new features.

---

## 0. Bug Fixes

### 0.1 submitKeyShare — Wrong Row Marked as Submitted

**Problem:** `submitKeyShare` used `submitted.length + 1` (an ordinal counter) as the primary key when marking a share as submitted, causing it to update the wrong database row. Admins who had a share assigned could not correctly submit it.

**Fix:** Look up the admin's actual share via `getSharesByElectionAndAdmin(electionId, adminId)`, then mark `row.id` directly. If the admin has no assigned share for this election, the action is refused.

| File                        | Lines   | Change                                                              |
| --------------------------- | ------- | ------------------------------------------------------------------- |
| `features/admin/actions.ts` | 135–165 | Replaced ordinal PK lookup with `getSharesByElectionAndAdmin` query |

---

### 0.2 tally() — Decryption Always Returned 0 (μ Placeholder)

**Problem:** `tally()` used a hardcoded `mu: "0"` as the Paillier private key parameter. Paillier decryption requires the real μ value computed as μ = (L(g^λ mod n²))⁻¹ mod n. With μ = 0, every candidate decrypted to 0 votes regardless of the actual ballot counts.

**Fix:** After reconstructing λ via Shamir secret sharing, recompute μ from λ and the public modulus N using the standard Paillier formula, then pass the real μ to `paillierDecrypt`.

| File                        | Lines            | Change                                                       |
| --------------------------- | ---------------- | ------------------------------------------------------------ |
| `features/admin/actions.ts` | 191–202, 239–246 | Recompute μ = `(L(g^λ mod n²))⁻¹ mod n` from reconstructed λ |

---

### 0.3 Time Window Enforcement

**Problem:** Blind signature requests, credential verification, and ballot submission were accepted even when an election was outside its scheduled `startTime`/`endTime`. Only `status === "OPEN"` was checked.

**Fix:** Added `validateElectionWindow(election)` checks in three places:

| #   | File                                                    | Lines | What was added                                                    |
| --- | ------------------------------------------------------- | ----- | ----------------------------------------------------------------- |
| 3   | `features/voting/actions.ts` (`requestBlindSignature`)  | 21–28 | `validateElectionWindow(election)` before issuing blind signature |
| 4   | `features/voting/actions.ts` (`verifyVotingCredential`) | 82–89 | Same — rejects credential if outside window                       |
| 5   | `app/api/vote/[electionId]/submit/route.ts`             | 31–37 | Same — rejects ballot if outside window                           |

---

### 0.4 Tally Page — Unassigned Admin Could Submit Share

**Problem:** The tally page (`/admin/tally/[id]`) rendered a "Submit Share" button for _any_ logged-in admin, even if they were not one of the `totalShares` admins who received a key share during election creation.

**Fix:** Server-side checks in the tally page:

- `hasAssignedShare` — verifies the current admin has a key share row for this election.
- `alreadySubmitted` — verifies the share has not already been used.
- The page now renders a roster showing which admins have already submitted their shares.

| File                                           | Change                                                                               |
| ---------------------------------------------- | ------------------------------------------------------------------------------------ |
| `app/(main)/admin/tally/[electionId]/page.tsx` | Added `hasAssignedShare` + `alreadySubmitted` checks; renders submitted-admin roster |

---

### 0.5 createElection — Shares Discarded (No Ceremony Output)

**Problem:** After `createElection` ran the key ceremony and distributed shares to admins, the UI showed nothing. Admins had no way to know which shares they received, making the threshold decryption ceremony impossible to perform manually.

**Fix:** After successful election creation, `CreateElectionForm.tsx` now renders a **Key Ceremony Output** card:

- Table listing each `(adminId, shareX, shareY)` triple.
- Collapsible JSON blob for secure copy-paste.
- Checkbox acknowledgment: _"I have recorded all shares..."_.
- Gated **"Continue to Manage Election"** button (disabled until checkbox is ticked).

| File                                               | Change                                                                  |
| -------------------------------------------------- | ----------------------------------------------------------------------- |
| `features/admin/components/CreateElectionForm.tsx` | Added `issued` state, share table, JSON copy, and gated continue button |

---

### 0.6 Legacy /results Mock Page Replaced

**Problem:** `/results` existed as a legacy mock page with hardcoded fake vote numbers. It was misleading and not connected to real election data.

**Fix:** Replaced the mock page with a server redirect to `/elections` (the real active-elections list).

| File                          | Change                                              |
| ----------------------------- | --------------------------------------------------- |
| `app/(main)/results/page.tsx` | Replaced mock content with `redirect("/elections")` |

---

### 0.7 Navbar "Results" Link Pointed to Mock

**Problem:** The top navigation bar's **Results** link pointed to the legacy `/results` mock page.

**Fix:** Updated the link destination to point to the real election list.

| File                    | Lines | Change                                  |
| ----------------------- | ----- | --------------------------------------- |
| `components/navbar.tsx` | 31–36 | `href="/results"` → `href="/elections"` |

---

## 1. Multi-Select Admin Share Assignment

### Problem

When the number of registered admins (`n`) exceeded the `totalShares` value configured for an election, the system could not decide which admins should receive key shares. The form automatically assigned shares to _all_ admins, causing a mismatch.

### Before

- `@/app/(main)/admin/elections/create/page.tsx`: Only passed `adminIds: number[]` to the form.
- `@/features/admin/components/CreateElectionForm.tsx`: Received a flat array of IDs and blindly sent them all to `createElection({ adminIds })`.

### After

- `@/app/(main)/admin/elections/create/page.tsx`: Now passes full `Voter[]` objects so names and emails can be displayed.
- `@/features/admin/components/CreateElectionForm.tsx`:
  - Added React state `selectedAdminIds` and `totalShares`.
  - When `admins.length > totalShares`, a **checkbox grid** appears allowing the creator to pick _exactly_ `totalShares` admins.
  - Visual feedback shows `{selected}/{total}` progress and a warning when the count is wrong.
  - When `admins.length <= totalShares`, the form auto-selects all admins and displays them as `Badge` chips.
  - Validation blocks submission until the correct number of admins is selected.

---

## 2. Admin-Promotion UI (`/admin/voters`)

### Problem

There was no user-facing way to promote a voter to admin (or demote an admin to voter). Role changes required database access or a manual script.

### Before

- No voters management page existed.
- `updateVoter` existed in `db-actions/voters.ts` but was unused in the UI.

### After

- **New page:** `@/app/(main)/admin/voters/page.tsx` — Server page that fetches all voters and renders the management panel.
- **New component:** `@/features/admin/components/VotersManagementPanel.tsx` — Client component with:
  - Sortable table (admin first, then alphabetical).
  - Role badge rendering (`default` for admin, `secondary` for voter).
  - One-click **Promote / Demote** button per row.
  - Loading state per row (`updatingId`).
- **New server action:** `updateVoterRole(voterId, role)` in `@/features/admin/actions.ts` — validates `role ∈ {"voter", "admin"}`.
- **Sidebar update:** `@/features/admin/components/AdminSidebar.tsx` now links to `/admin/voters`.

> **Note:** Because `role` is baked into the JWT at login, promoted/demoted users must **re-login** to see access changes. This is by design (middleware + server actions use the JWT). A future improvement would be to force-refresh sessions.

---

## 3. Candidate Edit / Reorder / Delete (SETUP only)

### Problem

After creating an election, candidates were immutable. Typos or ordering mistakes required deleting the entire election and starting over.

### Before

- `@/features/admin/components/ManageElectionPanel.tsx` only showed a read-only list of candidates and an "Add" form.

### After

- **New server actions** in `@/features/admin/actions.ts`:
  - `updateCandidate(electionId, candidateId, { name?, party?, position? })` — edits a candidate.
  - `deleteCandidateAction(electionId, candidateId)` — removes a candidate.
  - `reorderCandidates(electionId, candidateIds[])` — bulk-updates positions by swapping two adjacent candidates.
- **UI changes** in `ManageElectionPanel.tsx`:
  - Each candidate row now shows **Up**, **Down**, **Edit**, and **Delete** buttons (only during `SETUP`).
  - Inline editing: clicking **Edit** replaces the name/party text with `Input` fields and **Save / Cancel** buttons.
  - Reordering is done client-side via array swap, then persisted via `reorderCandidates`.
  - All actions are guarded by `election.status === "SETUP"` checks (both server and client).

---

## 4. Delete Election Control

### Problem

`deleteElection` existed in `db-actions/elections.ts` (with a `SETUP` status guard) but no UI exposed it.

### Before

- Deletion was only possible via direct database access.

### After

- **New server action:** `deleteElectionAction(electionId)` in `@/features/admin/actions.ts` — thin wrapper around `db-actions/elections.ts`.
- **UI addition:** `ManageElectionPanel.tsx` now shows a **"Delete Election"** button (destructive variant) only when `status === "SETUP"`.
- Uses a `<Dialog>` for confirmation to prevent accidental deletion.
- After deletion, the user is redirected to `/admin/elections`.

---

## 5. Recharts Integration (ResultsChart)

### Problem

The results page displayed a beautiful CSS-based table but lacked an interactive chart for visual vote comparison.

### Before

- `@/features/results/components/ResultsChart.tsx` rendered a styled table with progress bars.

### After

- **Installed dependency:** `recharts` (npm package).
- The component now renders **two sections**:
  1. A `ResponsiveContainer` + `BarChart` (from Recharts) with:
     - `CartesianGrid`, `XAxis`, `YAxis`, `Tooltip`.
     - Winner bar highlighted in primary blue; others in muted gray.
  2. The original detailed table (unchanged) for exact vote counts and percentages.
- Tooltip is themed to match the dark UI (`#1A1A1A` background, `#262626` border).

> This is a **polish** improvement, not a correctness fix. The existing CSS bars and table remain fully functional.

---

## 6. Supporting Infrastructure Added

### New UI Components

- `@/components/ui/checkbox.tsx` — Custom checkbox (no Radix dependency) supporting `onCheckedChange(checked: boolean)`.

### New Page Routes

- `/admin/voters` — Voter management & role promotion.

---

## 7. Files Modified (Summary)

| File                                                  | Change                                                                                                     |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `app/(main)/admin/elections/create/page.tsx`          | Pass full `Voter[]` instead of `number[]`                                                                  |
| `features/admin/components/CreateElectionForm.tsx`    | Multi-select admin picker, validation, Badge display                                                       |
| `features/admin/components/AdminSidebar.tsx`          | Added `/admin/voters` link                                                                                 |
| `features/admin/components/ManageElectionPanel.tsx`   | Delete election dialog, candidate edit/reorder/delete                                                      |
| `features/admin/components/VotersManagementPanel.tsx` | **New** — Role promotion table                                                                             |
| `features/admin/actions.ts`                           | `updateVoterRole`, `deleteElectionAction`, `updateCandidate`, `deleteCandidateAction`, `reorderCandidates` |
| `features/results/components/ResultsChart.tsx`        | Recharts bar chart + existing table                                                                        |
| `app/(main)/admin/voters/page.tsx`                    | **New** — Voter management page                                                                            |
| `components/ui/checkbox.tsx`                          | **New** — Custom checkbox component                                                                        |
| `package.json`                                        | Added `recharts` dependency                                                                                |

---

## 8. How to Use the New Features

### Assigning Key Shares to a Subset of Admins

1. Go to **Admin → Create Election**.
2. Set **Total Shares (n)** to a number _less_ than the total number of admins.
3. A **"Select Admins for Key Shares"** panel appears.
4. Check exactly `n` admins.
5. Submit — shares are generated only for the selected admins.

### Promoting a Voter to Admin

1. Go to **Admin → Voters**.
2. Find the user in the table.
3. Click **"Promote to Admin"** (or **"Demote to Voter"**).
4. The user must **log out and log back in** for JWT role changes to take effect.

### Editing Candidates Before Opening

1. Go to **Admin → Manage Elections → [Election]**.
2. While in `SETUP`, use the **Up / Down / Edit / Delete** icons on each candidate row.
3. Changes are blocked once the election is `OPEN`.

### Deleting an Election

1. Go to **Admin → Manage Elections → [Election]**.
2. While in `SETUP`, click **"Delete Election"**.
3. Confirm in the dialog.
4. The election is permanently removed.

---

## 9. Known Limitations

- **Role change requires re-login:** The JWT encodes `role` at sign-in time. A session refresh mechanism is not yet implemented.
- **Recharts peer-dep warning:** If `recharts` triggers React 19 peer-dep warnings, use `--legacy-peer-deps` during install.
- **Candidate reorder is adjacent-only:** The Up/Down buttons swap neighbors. A full drag-and-drop reorder is not yet implemented.

---

## 10. Complete File Change Index (Session Total)

| File                                                  | Status   | Description                                                                                                      |
| ----------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `app/(main)/admin/elections/create/page.tsx`          | Modified | Pass `Voter[]` objects instead of `number[]`                                                                     |
| `app/(main)/admin/layout.tsx`                         | Modified | Added `pt-20` for navbar offset                                                                                  |
| `app/(main)/admin/voters/page.tsx`                    | **New**  | Voter management page                                                                                            |
| `components/ui/checkbox.tsx`                          | **New**  | Custom checkbox without Radix dependency                                                                         |
| `db-actions/elections.ts`                             | Modified | Cascade-delete related rows before election deletion                                                             |
| `docs/session_changes.md`                             | **New**  | This document                                                                                                    |
| `features/admin/actions.ts`                           | Modified | Added `updateVoterRole`, `deleteElectionAction`, `updateCandidate`, `deleteCandidateAction`, `reorderCandidates` |
| `features/admin/components/AdminSidebar.tsx`          | Modified | Added `/admin/voters` navigation link                                                                            |
| `features/admin/components/CreateElectionForm.tsx`    | Modified | Multi-select admin picker; improved form spacing                                                                 |
| `features/admin/components/ManageElectionPanel.tsx`   | Modified | Delete election dialog; candidate edit/reorder/delete; fixed hydration + layout                                  |
| `features/admin/components/VotersManagementPanel.tsx` | **New**  | Role promotion/demotion table                                                                                    |
| `features/results/components/ResultsChart.tsx`        | Modified | Recharts bar chart integration; tooltip TypeScript fix                                                           |
| `package.json`                                        | Modified | Added `recharts` dependency                                                                                      |

---

## 11. Voter Restriction Enforcement (New)

### Problem

Elections with selected voters were not actually enforced. Any logged-in user could see and vote in any election regardless of voter restrictions.

### Fix

Implemented permission checks at multiple layers:

1. **`features/voting/actions.ts` (`requestBlindSignature`)**:
   - Added check: before issuing a blind signature, verifies the requesting voter is in the election's `allowedVoterIds` list (if the election has restricted voters).
   - Rejects with "You are not authorized to vote in this election".

2. **`features/elections/actions.ts` (`getElections`)**:
   - For regular voters, filters out elections they are not allowed to vote in.
   - Admins can still see all elections.

3. **`features/elections/actions.ts` (`getElectionById`)**:
   - Returns `permissions` object: `canView`, `canVote`, `isRestricted`, `isAllowed`.
   - `canView` is `true` for admins or allowed voters.
   - `canVote` is `true` only for voters in the allowed list.

4. **`app/(main)/elections/[electionId]/page.tsx`**:
   - Shows **Access Denied** page for voters not in the allowed list.
   - Shows **Admin View Only** message for admins who can view but cannot vote (not in voter list).
   - Shows normal voting UI only for allowed voters.

| File                                         | Change                                                              |
| -------------------------------------------- | ------------------------------------------------------------------- |
| `features/voting/actions.ts`                 | Added voter allowed check in `requestBlindSignature`                |
| `features/elections/actions.ts`              | Added filtering in `getElections`; permissions in `getElectionById` |
| `app/(main)/elections/[electionId]/page.tsx` | Access denied / admin view only / can vote logic                    |
