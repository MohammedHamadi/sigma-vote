import { InferSelectModel, InferInsertModel } from "drizzle-orm";

// ─── Table re-exports ───
export { voters } from "./voters";
export { elections } from "./elections";
export { candidates } from "./candidates";
export { ballots } from "./ballots";
export { usedTokens } from "./usedTokens";
export { keyShares } from "./keyShares";
export { blindSigLog } from "./blindSigLog";

// ─── Import tables for type inference ───
import { voters } from "./voters";
import { elections } from "./elections";
import { candidates } from "./candidates";
import { ballots } from "./ballots";
import { usedTokens } from "./usedTokens";
import { keyShares } from "./keyShares";
import { blindSigLog } from "./blindSigLog";

// ─── Select types (returned from queries) ───
export type Voter = InferSelectModel<typeof voters>;
export type Election = InferSelectModel<typeof elections>;
export type Candidate = InferSelectModel<typeof candidates>;
export type Ballot = InferSelectModel<typeof ballots>;
export type UsedToken = InferSelectModel<typeof usedTokens>;
export type KeyShare = InferSelectModel<typeof keyShares>;
export type BlindSigLogEntry = InferSelectModel<typeof blindSigLog>;

// ─── Insert types (used when creating records) ───
export type NewVoter = InferInsertModel<typeof voters>;
export type NewElection = InferInsertModel<typeof elections>;
export type NewCandidate = InferInsertModel<typeof candidates>;
export type NewBallot = InferInsertModel<typeof ballots>;
export type NewUsedToken = InferInsertModel<typeof usedTokens>;
export type NewKeyShare = InferInsertModel<typeof keyShares>;
export type NewBlindSigLogEntry = InferInsertModel<typeof blindSigLog>;
