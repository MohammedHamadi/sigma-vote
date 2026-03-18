// Ballot-related types

export interface EncryptedVote {
  candidateId: string;
  ciphertext: string; // BigInt serialized as string
}

export interface Proof {
  candidateId: string;
  proof: string; // ZKP proof data (JSON)
}

export interface Ballot {
  id: string;
  electionId: string;
  encryptedVotes: EncryptedVote[];
  proofs: Proof[];
  token: string;
  submittedAt: Date;
}
