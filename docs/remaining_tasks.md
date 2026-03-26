# Remaining Tasks for SigmaVote Project

## Task 1: Cryptographic Core

- [ ] **Paillier Encryption ([lib/crypto/paillier.ts](file:///d:/GitHub/sigma-vote/lib/crypto/paillier.ts)):**
  - Implement key generation (n, g, lambda, mu).
  - Implement encryption/decryption logic.
  - Implement homomorphic addition (multiplication of ciphertexts).
- [ ] **Shamir's Secret Sharing ([lib/crypto/shamir.ts](file:///d:/GitHub/sigma-vote/lib/crypto/shamir.ts)):**
  - Implement secret splitting into `n` shares.
  - Implement Lagrange interpolation for secret reconstruction.
- [ ] **RSA Blind Signatures ([lib/crypto/blind-signature.ts](file:///d:/GitHub/sigma-vote/lib/crypto/blind-signature.ts)):**
  - Implement blinding/unblinding logic.
  - Implement signing and verification.
- [ ] **Zero-Knowledge Proofs ([lib/crypto/zkp.ts](file:///d:/GitHub/sigma-vote/lib/crypto/zkp.ts)):**
  - Implement Sigma-protocol for 0-or-1 vote proof.
  - Implement proof verification logic.

## Task 2: Database & Data Access

- [ ] **Data Access Functions (`db-actions/`):**
  - Implement all functions in [voters.ts](file:///d:/GitHub/sigma-vote/db/schema/voters.ts), [elections.ts](file:///d:/GitHub/sigma-vote/db/schema/elections.ts), [candidates.ts](file:///d:/GitHub/sigma-vote/db/schema/candidates.ts), [ballots.ts](file:///d:/GitHub/sigma-vote/db/schema/ballots.ts), [keyShares.ts](file:///d:/GitHub/sigma-vote/db/schema/keyShares.ts), [usedTokens.ts](file:///d:/GitHub/sigma-vote/db/schema/usedTokens.ts), and [blindSigLog.ts](file:///d:/GitHub/sigma-vote/db/schema/blindSigLog.ts).
  - These should use Drizzle ORM to interact with the Neon Postgres database.

## Task 3: Backend Business Logic

_Status: Initial Auth implemented; others are to be done._

- [ ] **Election Management ([features/admin/actions.ts](file:///d:/GitHub/sigma-vote/features/admin/actions.ts)):**
  - Implement `createElection` (triggering key ceremony: Paillier keygen + Shamir split).
  - Implement `openElection` and `closeElection` status transitions.
- [ ] **Voting Logic ([features/voting/actions.ts](file:///d:/GitHub/sigma-vote/features/voting/actions.ts)):**
  - Implement [requestBlindSignature](file:///d:/GitHub/sigma-vote/features/voting/actions.ts#5-8) (eligibility check + RSA signing).
- [ ] **Anonymous Submission Route ([app/api/vote/[electionId]/submit/route.ts](file:///d:/GitHub/sigma-vote/app/api/vote/%5BelectionId%5D/submit/route.ts)):**
  - **CRITICAL:** Implement the anonymous POST handler that verifies blind signatures and ZKPs before storing ballots.
- [ ] **Tallying Logic ([features/admin/actions.ts](file:///d:/GitHub/sigma-vote/features/admin/actions.ts)):**
  - Implement `submitKeyShare`.
  - Implement the `tally` function (Reconstruct key → Homomorphic aggregate → Decrypt).

## Task 4: Frontend Development

_Status: Page structures exist; logic missing._

- [ ] **Voting Wizard ([features/voting/components/VotingWizard.tsx](file:///d:/GitHub/sigma-vote/features/voting/components/VotingWizard.tsx)):**
  - Implement the multi-step client-side flow.
  - Integrate client-side crypto (blinding, encryption, ZKP generation).
- [ ] **Admin Dashboard:**
  - Build the `CreateElectionForm` with key ceremony visualization.
  - Build `ManageElectionPanel` and `TallyPanel`.
- [ ] **Results Visualization:**
  - Connect `ResultsChart.tsx` to the `getResults` action using Recharts.

## Task 5: Security Documentation

_Status: This is for much later, easy._

- [ ] **Threat Model ([docs/threat_model.md](file:///d:/GitHub/sigma-vote/docs/threat_model.md)):** Detailed analysis of adversary models.
- [ ] **Attack Evaluation ([docs/attack_evaluation.md](file:///d:/GitHub/sigma-vote/docs/attack_evaluation.md)):** Matrix of attacks vs. mitigations.
- [ ] **Crypto Explanation ([docs/crypto_explanation.md](file:///d:/GitHub/sigma-vote/docs/crypto_explanation.md)):** Documentation of the math behind the system.

---
