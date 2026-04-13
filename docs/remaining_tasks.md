# Remaining Tasks for SigmaVote Project (Detailed)

This document tracks the remaining implementation work to fully match:
- `docs/Evoting_IP.md` (protocol + lifecycle requirements)
- `docs/Evoting_archi.md` (App Router + feature-module architecture)

---

## 0) Current Reality Snapshot (What is already in place)

- Core modules exist in `lib/crypto/` (Paillier, Shamir, blind signatures, ZKP).
- DB schema and db-actions exist (`db/schema/*`, `db-actions/*`).
- Admin/election/voting/results pages exist under `/elections/*` and `/admin/*`.
- Anonymous submission route exists at `app/api/vote/[electionId]/submit/route.ts`.
- Main missing pieces are:
  - End-to-end wiring of the cryptographic voting flow in the client wizard.
  - Route/link consistency across the app.
  - Several architectural stubs and security/documentation tasks.
  - A few correctness issues in tally/crypto flow that block reliable decryption.

---

## 1) P0 — End-to-End Workflow Linking (Most Important)

### 1.1 Unify canonical navigation paths
- [ ] Make `/elections` and `/elections/[electionId]/*` the canonical voter flow paths.
- [ ] Remove or refactor legacy mock routes:
  - `app/vote/page.tsx`
  - `app/vote/[id]/page.tsx`
  - `app/results/page.tsx`
- [ ] Update all links to canonical paths:
  - `components/navbar.tsx` (`/vote`, `/results` currently point to mock pages)
  - `app/page.tsx` CTA currently points to `/vote`
  - Any redirects in auth forms currently pushing to `/vote`

**Acceptance criteria**
- No user-facing path depends on mock data pages.
- All voter journey links consistently use `/elections/*`.
- No dead links in navbar/home/auth redirects.

### 1.2 Link full lifecycle across pages (Creation -> Vote -> Tally -> Results)
- [ ] Ensure complete route chain exists and is discoverable in UI:

**Admin setup flow**
1. `/admin/elections/create` -> create election + candidates + key ceremony
2. `/admin/elections/[electionId]` -> manage/open/close

**Voter flow**
3. `/elections` -> list open elections
4. `/elections/[electionId]` -> details + "Cast vote"
5. `/elections/[electionId]/vote` -> full crypto voting wizard

**Tally flow**
6. `/admin/tally/[electionId]` -> submit shares + run tally

**Results flow**
7. `/elections/[electionId]/results` -> public tallied results

- [ ] Add clear CTA buttons between lifecycle phases (e.g., after close election, "Go to tally"; after tally complete, "View public results").

**Acceptance criteria**
- A new user/admin can complete entire process from UI without manual URL editing.
- Every phase has a deterministic next step.

---

## 2) P0 — Voting Phase Completion (Client Crypto + Submission)

### 2.1 Implement real cryptographic wizard flow in `features/voting/components/VotingWizard.tsx`
- [ ] Replace placeholders (`token: "0"`, `signature: "0"`, `proofs: []`) with real values.
- [ ] Step 1: Generate token `T` and blinding factor `r` on client.
- [ ] Step 2: Blind token `T'`, call `requestBlindSignature`, unblind to get `S`.
- [ ] Step 3: Candidate selection.
- [ ] Step 4: Paillier encrypt vector `[v_1..v_k]` where exactly one is `1`.
- [ ] Step 5: Generate ZKPs per ciphertext (0-or-1) and sum=1 proof.
- [ ] Step 6: POST anonymous payload to `/api/vote/[electionId]/submit` with no auth context.
- [ ] Step 7: Success confirmation + redirect to election detail or results page when available.

**Acceptance criteria**
- Submitted payload includes real `token`, `signature`, `ciphertexts[]`, `proofs`.
- Backend accepts valid ballots and rejects malformed/forged ballots.
- Wizard state machine reflects the 7-step flow from `Evoting_IP.md`.

### 2.2 Add missing client helpers in voting feature layer
- [ ] Add/organize client crypto helpers in voting module (per architecture plan):
  - `encryptVote`
  - `generateProofs`
  - token blinding/unblinding helpers
- [ ] Ensure helpers use shared key data from election context (`paillierPubN`, `paillierPubG`, `rsaPubE`, `rsaPubN`).

**Acceptance criteria**
- Wizard does not contain opaque crypto logic inline; helpers are testable and reusable.

---

## 3) P0 — Backend Verification Gaps for Vote Integrity

### 3.1 Enforce full ballot validity in submission route
File: `app/api/vote/[electionId]/submit/route.ts`
- [ ] Validate payload lengths: `ciphertexts.length === candidates.length`.
- [ ] Validate `proofs` count/shape matches ciphertexts.
- [ ] Verify sum=1 proof (currently only per-ciphertext 0/1 proof is checked).
- [ ] Return deterministic 4xx errors for invalid structure/proofs.

**Acceptance criteria**
- Invalid "all zeros" or "multiple ones" ballots are rejected cryptographically.
- Only structurally and cryptographically valid ballots are persisted.

### 3.2 Election window and anonymity behavior
- [ ] Enforce election time window checks (`startTime`, `endTime`) in:
  - blind-sign server action
  - anonymous submit route
- [ ] Keep anonymous route independent from auth/session context by design.

**Acceptance criteria**
- Votes/signatures cannot be created outside election window.
- Anonymous submit remains session-agnostic.

---

## 4) P0 — Tally & Key Share Workflow Correctness

### 4.1 Fix share submission semantics
- [ ] Correct share submission logic in `features/admin/actions.ts` + `db-actions/keyShares.ts`.
- [ ] Current behavior marks a share by computed ordinal (`submitted.length + 1`) instead of actual admin share record ID.
- [ ] Ensure each admin submits only their own share record.

**Acceptance criteria**
- Share submissions are tied to authenticated admin identity and exact row.
- Threshold count reflects actual distinct admin submissions.

### 4.2 Complete threshold decryption correctness
- [ ] Align reconstructed private key usage with Paillier decrypt requirements.
- [ ] Ensure decryption uses consistent private parameters (no placeholder `mu` values).
- [ ] Confirm tally output equals homomorphic aggregate decryption for each candidate.

**Acceptance criteria**
- Tally returns correct vote totals for multi-ballot scenarios.
- Decryption works after threshold shares are submitted.

---

## 5) P1 — Architecture Alignment Cleanup

### 5.1 Resolve duplicated shared UI layer
- [ ] Either:
  - migrate app to use `features/shared/components/Navbar.tsx` + `Footer.tsx`, or
  - delete stubs in `features/shared/components/*` and keep `components/*` as source of truth.
- [ ] Implement or remove `features/shared/hooks/useAuth.ts` stub.

**Acceptance criteria**
- No stale placeholder components/hooks in active architecture.
- Shared component strategy is consistent and documented.

### 5.2 Middleware auth guard
File: `middleware.ts`
- [ ] Replace passthrough with actual route protection rules for admin and voting-sensitive routes.
- [ ] Ensure server-side guards remain authoritative (middleware is defense-in-depth).

**Acceptance criteria**
- Unauthorized users cannot access admin paths.
- Middleware and server actions enforce consistent policy.

---

## 6) P1 — UI/UX Gaps for Key Pages and Components

### 6.1 Voting and election UX
- [ ] Add "not open yet / closed / tallied" state-specific messaging on election detail pages.
- [ ] Improve wizard error surfacing (network/crypto/proof errors).
- [ ] Add post-vote confirmation page behavior consistent with anonymity model (no revealing receipt that compromises privacy).

### 6.2 Results UX
- [ ] Add "Election not yet tallied" friendly state on results route.
- [ ] Display audit metadata (ballot count, threshold, status timeline, tally timestamp).

### 6.3 Admin UX
- [ ] Show key-ceremony outputs clearly after creation (share assignment visibility).
- [ ] Add stronger state indicators for setup/open/closed/tallied transitions.
- [ ] Improve tally panel feedback for "shares submitted vs required".

**Acceptance criteria**
- Every key page (`create`, `manage`, `vote`, `tally`, `results`) has complete state handling and clear next actions.

---

## 7) P1 — Security Hardening Tasks (Crypto Module)

Files: `lib/crypto/*.ts`
- [ ] Replace non-cryptographic challenge hash in ZKP with cryptographic hash.
- [ ] Implement/verify sum=1 proof support in ZKP module.
- [ ] Harden blind signature handling (message encoding/domain separation).
- [ ] Improve typing (replace pervasive `unknown` key types with strict interfaces).

**Acceptance criteria**
- Crypto API is typed, deterministic, and aligned with protocol claims in docs.

---

## 8) P2 — Documentation Completion

- [ ] Fill `docs/threat_model.md` with adversaries, assets, trust boundaries, assumptions.
- [ ] Fill `docs/attack_evaluation.md` with attack matrix and residual risk.
- [ ] Fill `docs/crypto_explanation.md` with implementation-accurate protocol math and flow.
- [ ] Update architecture docs if route canonicalization changes.

**Acceptance criteria**
- Security docs are no longer stubs and reflect actual implementation.

---

## 9) P2 — Testing & Verification

- [ ] Add automated tests (unit + integration) matching `Evoting_IP.md` verification plan:
  - Paillier
  - Shamir
  - blind signatures
  - ZKP
  - end-to-end election flow
- [ ] Add route-level tests for anonymous submission constraints.
- [ ] Add manual QA checklist for full lifecycle.

**Acceptance criteria**
- Reproducible test suite verifies cryptographic and workflow correctness.

---

## 10) Proposed Implementation Order (Execution Plan)

1. **Route/link unification (P0)**
2. **VotingWizard real crypto integration (P0)**
3. **Submission verification hardening (P0)**
4. **Share submission + tally correctness fixes (P0)**
5. **Stateful UX polish on vote/tally/results/admin pages (P1)**
6. **Architecture cleanup (shared component duplication, middleware) (P1)**
7. **Security docs + test suite (P2)**

---

## Quick Blockers to Resolve First

- [ ] Canonical routing decision: keep only `/elections/*` for production flow.
- [ ] Decryption correctness in tally path (must be reliable before any demo).
- [ ] Voting wizard payload must stop sending placeholder values.
