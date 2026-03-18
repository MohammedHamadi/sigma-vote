# SigmaVote: Cryptographically Secure E-Voting

> **An end-to-end verifiable, anonymous, and homomorphically tallied electronic voting system.**

## Abstract
SigmaVote is a prototype electronic voting architecture designed to resolve the fundamental conflict of digital elections: guaranteeing absolute voter anonymity while providing mathematical proof of the election's integrity. By orchestrating Additively Homomorphic Encryption (Paillier), RSA Blind Signatures, Zero-Knowledge Proofs (Sigma Protocols), and Threshold Cryptography (Shamir's Secret Sharing), this system ensures that votes are cast confidentially, tallied without decryption, and verified without compromising privacy.

---

## Cryptographic Architecture

The security model relies on four core cryptographic primitives, working in tandem to prevent both external compromise and internal corruption:

* **Voter Anonymity (RSA Blind Signatures):** Voters authenticate with their real identity to receive an authorization token. Using RSA blind signatures, the server signs this token without ever seeing its contents, mathematically decoupling the voter's identity from their eventual ballot.
* **Encrypted Tallying (Paillier Homomorphic Encryption):** Votes are encrypted client-side using the Paillier cryptosystem. Because Paillier is additively homomorphic, the server can compute the final election results by multiplying the ciphertexts together: E(m₁) × E(m₂) mod n² = E(m₁ + m₂). The server tallies the votes without ever decrypting individual ballots.
* **Ballot Integrity (Zero-Knowledge Proofs):** To prevent voters from encrypting invalid weights (e.g., casting 100 votes for one candidate), each ballot is accompanied by a Disjunctive Chaum-Pedersen Zero-Knowledge Proof. This Sigma protocol proves to the server that the encrypted ciphertext contains strictly a `0` or a `1`, without revealing which one.
* **Distributed Trust (Shamir's Secret Sharing):** The private key required to decrypt the final election tally is never held by a single entity. It is split among multiple election administrators using polynomial interpolation. The final results can only be decrypted when a predefined threshold (e.g., t-of-n) of administrators submit their key shares.

---

## System Workflow

### 1. Registration & Authorization
The voter authenticates and generates a random token locally. The token is cryptographically blinded and sent to the server. The server verifies the voter's eligibility, signs the blinded token, and returns it. The voter unblinds it to reveal a valid, signed token that the server cannot link to their identity.

### 2. Casting the Ballot
The voter selects their candidate. The client-side application encrypts the choice using the election's Paillier public key and generates the required Zero-Knowledge Proofs. The encrypted ballot, the ZKPs, and the anonymous signed token are submitted to the server over an anonymous channel.

### 3. Verification & Tallying
The server verifies the signature on the token (preventing unauthorized votes), checks the token against a nullifier list (preventing double-voting), and verifies the ZKPs (ensuring the vote is a valid 0 or 1). Valid ciphertexts are homomorphically aggregated into a single encrypted master tally.

### 4. Threshold Decryption
Once the election concludes, administrators submit their individual private key shares. When the mathematical threshold is reached, the Paillier private key is reconstructed in memory, the master ciphertext is decrypted, and the final results are published.

---

## Tech Stack

* **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui
* **Backend:** Node.js / Next.js API Routes
* **Database:** Neon (Serverless Postgres), Drizzle ORM
* **Cryptography:** `paillier-bigint`, `shamirs-secret-sharing`, Native JS `BigInt` for custom ZKP circuits

---

## Security Guarantees & Threat Model

* **End-to-End Verifiability:** Voters can verify their ciphertext was included in the final aggregated tally.
* **Receipt-Freeness:** Voters cannot prove *how* they voted to a third party, preventing voter coercion and vote-selling.
* **Robustness:** The system tolerates the compromise of up to t-1 election administrators without exposing the private key or altering the results.
* **No Central Point of Trust:** The server routing the votes learns nothing about the contents of the ballots.

---

## Getting Started

### Prerequisites
Node.js (v18+), npm/pnpm, and a Neon Postgres Database URL.

### Installation

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/MohammedHamadi/sigma-vote.git
cd sigmavote
npm install
```

2. Configure environment variables (`.env.local`):
```env
DATABASE_URL="postgresql://user:password@neon-hostname.neon.tech/dbname?sslmode=require"
```

3. Generate the database schema:
```bash
npx drizzle-kit push
```

4. Start the development server:
```bash
npm run dev
\`\`\`
