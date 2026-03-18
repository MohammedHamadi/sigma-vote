// Election-related types

export type ElectionStatus = "DRAFT" | "OPEN" | "CLOSED" | "TALLIED";

export interface Election {
  id: string;
  name: string;
  description?: string;
  status: ElectionStatus;
  publicKey?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
}

export interface Candidate {
  id: string;
  electionId: string;
  name: string;
  description?: string;
}
