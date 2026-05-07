# SigmaVote | Cryptographic E-Voting Platform

**An end-to-end verifiable, anonymous, and homomorphically tallied electronic voting system.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-green)](https://orm.drizzle.team/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-blue?logo=postgresql)](https://neon.tech/)
[![Auth.js](https://img.shields.io/badge/Auth.js-NextAuth-orange)](https://authjs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## Overview

SigmaVote is a **prototype electronic voting architecture** designed to resolve the fundamental conflict of digital elections: guaranteeing absolute voter anonymity while providing mathematical proof of the election's integrity. The platform orchestrates four advanced cryptographic primitives — Additively Homomorphic Encryption (Paillier), RSA Blind Signatures, Zero-Knowledge Proofs (Sigma Protocols), and Threshold Cryptography (Shamir's Secret Sharing) — to ensure that votes are cast confidentially, tallied without decryption, and verified without compromising privacy.

The platform caters to two distinct stakeholder groups:

- **Voters** — Register, authenticate, obtain anonymous voting credentials via blind signatures, encrypt ballots client-side, and cast votes with zero-knowledge proofs guaranteeing ballot validity.
- **Administrators** — Create and manage elections, configure candidate rosters, control election lifecycle (SETUP → OPEN → CLOSED → TALLIED), and participate in threshold decryption by submitting Shamir secret shares.

SigmaVote also ships with an integrated documentation site powered by Fumadocs, providing mathematical breakdowns and user guides directly within the application.

---

## Features

### Public-Facing Platform

| Feature                        | Implementation                                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| **Cryptographic Landing Page** | Dynamic hero with animated diagrams illustrating Blind Signatures, Homomorphic Encryption, and ZKP workflows.                |
| **Election Browser**           | Lists all elections with real-time status indicators (SETUP, OPEN, CLOSED, TALLIED) and contextual "View Results" actions.   |
| **Credential Generation**      | Multi-step wizard: generates a random token, blinds it, sends to server for signing, unblinds, and packages as a credential. |
| **Voting Wizard**              | Step-by-step flow: credential input → candidate selection → client-side Paillier encryption + ZKP generation → submission.   |
| **Results Dashboard**          | Live results with ranked candidate charts (Recharts), ballot counts, and election metadata.                                  |
| **Integrated Documentation**   | Fumadocs-powered docs site with KaTeX math rendering for cryptographic protocol explanations.                                |
| **Authentication System**      | Credentials-based auth (Auth.js v5 beta) with JWT sessions, bcrypt password hashing, and role-based access control.          |

### Admin Panel

| Feature                      | Implementation                                                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Election Lifecycle**       | Full SETUP → OPEN → CLOSED → TALLIED state machine with guard rails (e.g., cannot open without candidates).                   |
| **Key Ceremony**             | Automatic Paillier + RSA keypair generation, Shamir (t,n) secret splitting, and email distribution of shares to admins.       |
| **Candidate Management**     | CRUD operations with position-based ordering, restricted to SETUP phase.                                                      |
| **Voter Registry**           | Paginated voter table with search, role management (voter/admin), and per-election voter restriction lists.                   |
| **Threshold Tally**          | Admins submit their Shamir shares (SHA-256 commitment verified); once threshold is met, homomorphic aggregation + decryption. |
| **Share Email Distribution** | Nodemailer/Gmail integration for automated delivery of secret shares to designated key-holders upon election creation.        |

---

## Architecture

SigmaVote implements a **Modular Feature-Based Architecture** built on the Next.js App Router. It enforces a strict separation between the data layer and UI logic through a server-action pattern combined with a centralized Data Access Layer.

```
/features/{feature}/
├── components/          # React components specific to the feature
└── actions.ts           # Business logic and data mutations (Server Actions)

/db/schema/              # Drizzle ORM schema definitions (8 tables)
/db-actions/             # Centralized Data Access Layer (DAL)
/lib/crypto/             # Custom cryptographic primitives (Paillier, Shamir, ZKP, Blind Sig)
/app/                    # Next.js route handlers and page composition
/components/ui/          # shadcn/ui design system primitives
/lib/                    # Cross-cutting utilities (Auth, Email, DB Helpers)
```

**Key architectural principles:**

- **Data Access Layer (DAL)**: All database interactions are encapsulated in `db-actions/`, providing a consistent API consumed by Server Actions and API routes. Every DAL function includes structured error logging (`[db-actions]` prefix).
- **Client-Side Cryptography**: All vote encryption, ZKP generation, and blind signature operations execute in the browser (`lib/crypto/ballot-client.ts`, `lib/crypto/blind-sig-client.ts`). The server never sees plaintext votes.
- **Server-Side Verification**: The ballot submission API (`api/vote/[electionId]/submit`) independently verifies blind signatures, checks token uniqueness (nullifier list), and validates all ZKPs before accepting a ballot.
- **BigInt Serialization**: A dedicated utility layer (`lib/db-utils.ts`) handles the conversion of JavaScript `BigInt` values to/from JSON for database storage and API transport.

### Route Groups (App Router)

| Group           | Purpose                                                        | Auth                   |
| --------------- | -------------------------------------------------------------- | ---------------------- |
| `(main)`        | Public-facing landing, elections browser, voting, and results  | Mixed (Public + Auth)  |
| `(main)/(auth)` | Login and registration pages                                   | Public                 |
| `(main)/admin`  | Election management, voter management, tally, and key ceremony | Protected (Admin role) |
| `api/auth`      | NextAuth.js handler (`[...nextauth]`)                          | Public                 |
| `api/vote`      | Ballot submission endpoint with cryptographic verification     | Anonymous (Token auth) |
| `api/search`    | Fumadocs full-text documentation search                        | Public                 |
| `docs`          | Fumadocs documentation site with KaTeX math rendering          | Public                 |
| `presentation`  | Standalone presentation/demo page                              | Public                 |

---

## Tech Stack

| Layer             | Technology                                                     |
| ----------------- | -------------------------------------------------------------- |
| **Framework**     | Next.js 16.2.3 (App Router)                                    |
| **Language**      | TypeScript 5.x                                                 |
| **Styling**       | Tailwind CSS 4.x, CSS Variables, Motion (Framer Motion)        |
| **Database**      | PostgreSQL via Neon (Serverless, HTTP driver)                  |
| **ORM**           | Drizzle ORM 0.45.1                                             |
| **Auth**          | Auth.js (NextAuth v5 beta) — Credentials provider + JWT        |
| **Email**         | Nodemailer (Gmail SMTP)                                        |
| **UI Components** | shadcn/ui, Base UI, Lucide Icons                               |
| **Validation**    | bcryptjs (password hashing)                                    |
| **Charts**        | Recharts 3.x                                                   |
| **Documentation** | Fumadocs (MDX + KaTeX for math rendering)                      |
| **Cryptography**  | Custom implementations — Paillier, Shamir, RSA Blind Sigs, ZKP |

---

## Cryptographic Architecture

The security model relies on four core primitives, working in tandem to prevent both external compromise and internal corruption:

### 1. Voter Anonymity — RSA Blind Signatures

Voters authenticate with their real identity to request an authorization token. Using RSA blind signatures (`lib/crypto/blind-signature.ts`), the server signs a blinded token without ever seeing its contents, mathematically decoupling the voter's identity from their eventual ballot. The `blind_sig_log` table tracks **who** received a signature (preventing double-issuance), but this record is permanently unlinked from the submitted ballot.

### 2. Encrypted Tallying — Paillier Homomorphic Encryption

Votes are encrypted client-side using the Paillier cryptosystem (`lib/crypto/paillier.ts`, 2048-bit keys). Because Paillier is additively homomorphic, the server computes election results by multiplying ciphertexts: `E(m₁) × E(m₂) mod n² = E(m₁ + m₂)`. Individual ballots are **never decrypted**.

### 3. Ballot Integrity — Zero-Knowledge Proofs

Each ballot is accompanied by two classes of ZKP (`lib/crypto/zkp.ts`):

- **Per-Candidate Proof (Disjunctive Chaum-Pedersen)**: Proves each ciphertext encrypts strictly a `0` or a `1`, without revealing which. Uses the Fiat-Shamir heuristic (SHA-256) for non-interactive verification.
- **Sum Proof (Schnorr)**: Proves the homomorphic product of all per-candidate ciphertexts equals `g mod n²`, guaranteeing exactly one vote was cast across all candidates.

### 4. Distributed Trust — Shamir's Secret Sharing

The Paillier private key (`lambda`) is never held by a single entity. Upon election creation, it is split into `n` shares with a threshold `t` using polynomial interpolation over a 256-bit prime field (`lib/crypto/shamir.ts`). Shares are emailed to designated administrators. The election can only be tallied when `t` administrators submit their shares (verified against SHA-256 commitments stored at creation time).

---

## Project Structure

```
sigma-vote/
├── app/                              # Next.js App Router
│   ├── (main)/                       # Primary route group (with Navbar/Footer)
│   │   ├── (auth)/                   #   Login and registration pages
│   │   │   ├── login/                #     Credentials login
│   │   │   └── register/            #     New voter registration
│   │   ├── admin/                    #   Admin panel (election + voter mgmt)
│   │   │   ├── elections/            #     Per-election management
│   │   │   ├── tally/               #     Threshold decryption interface
│   │   │   └── voters/              #     Voter registry
│   │   ├── elections/                #   Public election browser + detail view
│   │   │   └── [electionId]/        #     Voting wizard per election
│   │   ├── results/                  #   Election results page
│   │   └── page.tsx                  #   Landing page (cryptographic showcase)
│   ├── api/                          # API Routes
│   │   ├── auth/[...nextauth]/       #   Auth.js catch-all handler
│   │   ├── search/                   #   Fumadocs search endpoint
│   │   └── vote/[electionId]/submit/ #   Anonymous ballot submission
│   ├── docs/                         # Fumadocs documentation site
│   └── presentation/                 # Standalone demo/presentation page
├── components/                       # Shared UI components
│   ├── navbar.tsx                    #   Global navigation (session-aware)
│   ├── footer.tsx                    #   Global footer
│   ├── ui/                           #   shadcn/ui primitives (14 components)
│   └── docs/                         #   Documentation-specific components
├── content/                          # Fumadocs MDX content
│   └── docs/                         #   Architecture, cryptography, user-guide
├── db/                               # Database layer
│   ├── index.ts                      #   Neon HTTP connection via Drizzle
│   └── schema/                       #   8 table definitions
│       ├── voters.ts                 #     User accounts and roles
│       ├── elections.ts              #     Elections with crypto keys
│       ├── candidates.ts            #     Candidates per election
│       ├── ballots.ts               #     Anonymous encrypted ballots
│       ├── keyShares.ts             #     Shamir secret shares
│       ├── electionVoters.ts        #     Voter restriction lists
│       ├── usedTokens.ts            #     Nullifier list (double-vote prevention)
│       └── blindSigLog.ts           #     Blind signature issuance log
├── db-actions/                       # Centralized Data Access Layer (8 modules)
│   ├── elections.ts                  #   Election CRUD + cascade delete
│   ├── voters.ts                     #   Voter CRUD + search + pagination
│   ├── candidates.ts                #   Candidate CRUD + bulk operations
│   ├── ballots.ts                   #   Ballot insertion + queries
│   ├── keyShares.ts                 #   Share storage + commitment verification
│   ├── electionVoters.ts           #   Voter restriction management
│   ├── usedTokens.ts               #   Token nullifier operations
│   └── blindSigLog.ts              #   Signature issuance tracking
├── features/                         # Feature modules (6 modules)
│   ├── admin/                        #   Election creation, tally, voter mgmt
│   │   ├── actions.ts               #     19 server actions
│   │   └── components/              #     6 components (forms, panels, sidebar)
│   ├── auth/                         #   Login, register, sign-out actions
│   ├── elections/                    #   Election listing + detail queries
│   ├── voting/                       #   Blind sig request, credential verify
│   │   └── components/              #     7 components (wizard, selector, etc.)
│   ├── results/                      #   Result aggregation + display
│   └── shared/                       #   Protected routes, shared hooks
├── lib/                              # Core utilities
│   ├── crypto/                       #   Cryptographic primitives (10 modules)
│   │   ├── paillier.ts              #     Keypair gen, encrypt, decrypt, homomorphic add
│   │   ├── shamir.ts                #     Secret splitting + reconstruction
│   │   ├── blind-signature.ts       #     RSA key gen, blind, sign, unblind, verify
│   │   ├── zkp.ts                   #     ZKP generation + verification (424 lines)
│   │   ├── ballot-client.ts         #     Client-side ballot encryption pipeline
│   │   ├── blind-sig-client.ts      #     Client-side credential generation
│   │   ├── proof-serialization.ts   #     BigInt ↔ string proof marshalling
│   │   ├── bigint-utils.ts          #     modPow, modInverse, gcd, randomPrime
│   │   └── index.ts                 #     Barrel exports
│   ├── auth/                         #   Session helpers (placeholder)
│   ├── db-utils.ts                   #   Token hashing, election window validation
│   ├── email.ts                      #   Nodemailer transport (share delivery)
│   └── utils.ts                      #   General utilities (cn)
├── types/                            # Shared TypeScript type definitions
│   ├── crypto.ts                     #   PaillierKeyPair, RSAKeyPair, KeyShare
│   ├── election.ts                   #   Election-related types
│   ├── voter.ts                      #   Voter-related types
│   └── ballot.ts                     #   Ballot-related types
├── scripts/                          # Maintenance and test scripts
│   ├── test-tally-crypto.ts         #   Cryptographic tally integration test
│   └── test-misc.ts                 #   Miscellaneous utility tests
├── auth.ts                           # NextAuth configuration (root)
├── middleware.ts                     # Route protection (admin, voting)
├── drizzle.config.ts                 # Drizzle Kit configuration
├── source.config.ts                  # Fumadocs MDX configuration
└── next.config.ts                    # Next.js + Fumadocs MDX integration
```

---

## Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher.
- **Database**: A PostgreSQL instance ([Neon](https://neon.tech/) recommended).
- **Email** _(optional)_: Gmail account with an App Password for share distribution.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MohammedHamadi/sigma-vote.git
cd sigma-vote

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env .env.local
# Fill in the variables listed below

# 4. Database Initialization
npx drizzle-kit push      # Sync schema to database

# 5. Explore the database (optional)
npx drizzle-kit studio    # Opens Drizzle Studio at https://local.drizzle.studio

# 6. Start development server
npm run dev               # Access at http://localhost:3000
```

### Core Commands

| Command               | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `npm run dev`         | Starts the development server with Hot Module Replacement. |
| `npm run build`       | Compiles the production application.                       |
| `npm run start`       | Runs the built application in production mode.             |
| `npm run lint`        | Runs ESLint to check for code quality issues.              |
| `npm run db:generate` | Generates Drizzle migration files from schema changes.     |
| `npm run db:migrate`  | Applies pending migrations to the database.                |
| `npm run db:studio`   | Opens Drizzle Studio for visual database exploration.      |

---

## Environment Variables

| Variable          | Required | Description                                                                      |
| ----------------- | -------- | -------------------------------------------------------------------------------- |
| `DATABASE_URL`    | Yes      | Neon PostgreSQL connection string (with `?sslmode=require`).                     |
| `AUTH_SECRET`     | Yes      | Secret for Auth.js JWT session encryption. Generate with `openssl rand -hex 32`. |
| `AUTH_TRUST_HOST` | Yes      | Set to `true` for local development to trust `localhost` as a valid host.        |
| `NEXTAUTH_URL`    | Yes      | Base URL of the application (e.g., `http://localhost:3000`).                     |
| `EMAIL_USER`      | No       | Gmail address for sending key-share emails to administrators.                    |
| `EMAIL_PASS`      | No       | Gmail App Password (not the account password). Required for share distribution.  |

> [!NOTE]
> The `EMAIL_USER` and `EMAIL_PASS` variables are optional. If not configured, the system will skip email delivery of Shamir secret shares, and administrators will need to receive their shares through an alternative secure channel.

---

## Database Schema

### Core Entities

| Entity              | Table             | Purpose                                                                                              |
| ------------------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| **Voters**          | `voters`          | Central user table with email, bcrypt password hash, name, and role (`voter` or `admin`).            |
| **Elections**       | `elections`       | Election metadata, Paillier public key (n, g), RSA keys (e, n, d), threshold, status, and results.   |
| **Candidates**      | `candidates`      | Named candidates with party affiliation and position index, linked to an election via FK.            |
| **Ballots**         | `ballots`         | Anonymous encrypted ballots — ciphertexts + ZKPs + anonymous token. **No voter FK by design.**       |
| **Key Shares**      | `key_shares`      | Shamir shares per admin per election, with SHA-256 commitment and submission tracking.               |
| **Election Voters** | `election_voters` | Optional voter restriction list (whitelist) per election. Cascade deletes on parent removal.         |
| **Used Tokens**     | `used_tokens`     | Nullifier list storing SHA-256 hashes of used ballot tokens. PK on `token_hash`.                     |
| **Blind Sig Log**   | `blind_sig_log`   | Records which voter received a blind signature per election. Unique constraint on (election, voter). |

### Key Relationships

| Parent        | Relation | Child              | Description                                              |
| ------------- | -------- | ------------------ | -------------------------------------------------------- |
| `voters`      | 1 → N   | `key_shares`       | Each admin voter holds one Shamir share per election.    |
| `voters`      | 1 → N   | `blind_sig_log`    | Tracks which voter received a blind signature.           |
| `voters`      | 1 → N   | `election_voters`  | Maps voters to the elections they are allowed to join.   |
| `elections`   | 1 → N   | `candidates`       | Each election has multiple candidates.                   |
| `elections`   | 1 → N   | `ballots`          | Anonymous ballots submitted to an election.              |
| `elections`   | 1 → N   | `key_shares`       | Private key is split into N shares per election.         |
| `elections`   | 1 → N   | `used_tokens`      | Nullifier list preventing double-voting.                 |
| `elections`   | 1 → N   | `blind_sig_log`    | Issuance log scoped per election.                        |
| `elections`   | 1 → N   | `election_voters`  | Optional voter whitelist per election.                   |

### Critical Design Decision

The `ballots` table intentionally contains **no foreign key to `voters`**. This is the core anonymity guarantee of the system. Once a voter obtains a blind signature and unblinds it, the resulting token is mathematically unlinkable to their identity. Submitted ballots reference only this anonymous token.

---

## Core Modules & Data Flow

### Election Lifecycle State Machine

```
SETUP ──→ OPEN ──→ CLOSED ──→ TALLIED
  │          │         │
  │ Add      │ Voters  │ Admins submit
  │ candidates │ cast   │ key shares
  │ + admins │ ballots │ (threshold met)
  │          │         │
  ▼          ▼         ▼
 Key        Blind     Homomorphic
 Ceremony   Sigs +    Aggregation +
 (Shamir)   ZKPs      Decryption
```

### Data Flow: Voting Protocol

1. **Credential Acquisition** (Authenticated — `features/voting/actions.ts`):
   - Voter generates a random token `T` in the browser.
   - `T` is blinded: `T' = T · r^e mod n` (RSA blinding).
   - `T'` is sent to the server via `requestBlindSignature()`.
   - Server verifies voter eligibility, signs `T'` → `S'`, logs the issuance in `blind_sig_log`.
   - Client unblinds: `S = S' · r⁻¹ mod n` to obtain a valid signature on `T`.
   - The pair `(T, S)` is the anonymous voting credential.

2. **Ballot Construction** (Client-side — `lib/crypto/ballot-client.ts`):
   - Selected candidate index is encoded as a vector: `[0, 0, 1, 0, ...]` (one `1`, rest `0`s).
   - Each value is Paillier-encrypted: `Cᵢ = g^mᵢ · rᵢ^N mod N²`.
   - Blinding factors are constrained: `∏rᵢ ≡ 1 (mod N)` for the sum proof.
   - Per-candidate ZKPs (Disjunctive Chaum-Pedersen) are generated.
   - A sum-equals-one proof (Schnorr) is generated.
   - All values are serialized for transport.

3. **Ballot Submission** (Anonymous — `api/vote/[electionId]/submit/route.ts`):
   - Server verifies RSA signature on token `T` → valid blind signature.
   - Server checks `T` against `used_tokens` → not double-voted.
   - Server deserializes and verifies all ZKPs (`verifyBallot`).
   - If valid: ballot stored in `ballots`, token hash stored in `used_tokens`.

4. **Tally** (Admin — `features/admin/actions.ts → tally()`):
   - Admins submit Shamir shares (verified against SHA-256 commitments).
   - Once `t` shares are collected, `lambda` is reconstructed via Lagrange interpolation.
   - `mu` is recomputed from `lambda` and the public key.
   - For each candidate, all ballot ciphertexts are homomorphically multiplied.
   - The aggregate ciphertext is decrypted to reveal the plaintext vote count.
   - Results are stored as JSON in the `elections.results` column.

---

## Scripts & Commands

### NPM Scripts

| Script        | Command                | Purpose                                                    |
| ------------- | ---------------------- | ---------------------------------------------------------- |
| `dev`         | `next dev`             | Starts the development server with HMR and Turbopack.      |
| `build`       | `next build`           | Compiles a production-optimized build.                     |
| `start`       | `next start`           | Serves the production build.                               |
| `lint`        | `eslint`               | Runs ESLint across the project.                            |
| `db:generate` | `drizzle-kit generate` | Generates SQL migration files from Drizzle schema changes. |
| `db:migrate`  | `drizzle-kit migrate`  | Applies generated migrations to the connected database.    |
| `db:studio`   | `drizzle-kit studio`   | Launches Drizzle Studio for visual database management.    |

### Test Scripts

| Script                 | Location                       | Purpose                                                                                                                                               |
| ---------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `test-tally-crypto.ts` | `scripts/test-tally-crypto.ts` | End-to-end integration test of the cryptographic tally pipeline. Tests key generation, encryption, homomorphic aggregation, and threshold decryption. |
| `test-misc.ts`         | `scripts/test-misc.ts`         | Miscellaneous utility and helper function tests.                                                                                                      |
| `test-crypto.ts`       | `test-crypto.ts` (root)        | Standalone cryptographic primitive verification.                                                                                                      |

> [!IMPORTANT]
> **Assumed Configuration:** There is no formal test runner configured in `package.json` (no `test` script). The test files under `scripts/` are intended to be run manually via `npx tsx scripts/test-tally-crypto.ts`. A production deployment should integrate a proper test framework (e.g., Vitest or Jest).

---

## Security Guarantees & Threat Model

- **End-to-End Verifiability**: Voters can verify their ciphertext was included in the final aggregated tally via the stored ballot token.
- **Receipt-Freeness**: Voters cannot prove _how_ they voted to a third party, preventing voter coercion and vote-selling.
- **Robustness**: The system tolerates the compromise of up to `t-1` election administrators without exposing the private key or altering results.
- **No Central Point of Trust**: The server routing votes learns nothing about the contents of the ballots. Individual vote decryption is computationally infeasible without the full private key.

> [!WARNING]
> **Middleware Status:** The route protection middleware (`middleware.ts`) currently contains a placeholder implementation. It matches `/admin/:path*` and `/elections/:path*/vote` but does not enforce JWT verification or role checks. Authentication is currently enforced at the component and server-action level via `auth()` session checks. This should be hardened for production deployment.

---

- Repository: [github.com/MohammedHamadi/sigma-vote](https://github.com/MohammedHamadi/sigma-vote)

---

_This document is the official technical reference for SigmaVote. For cryptographic protocol details with full mathematical notation, refer to the integrated documentation site at `/docs`._
