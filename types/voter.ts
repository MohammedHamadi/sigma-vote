// Voter-related types

export type VoterRole = "voter" | "admin";

export interface Voter {
  id: string;
  name: string;
  email: string;
  role: VoterRole;
  createdAt: Date;
}
