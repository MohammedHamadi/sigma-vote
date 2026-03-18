"use server";

// TODO: Implement admin server actions

export async function createElection(formData: FormData) {
  // TODO: Create election, generate Paillier keypair, split with Shamir
}

export async function openElection(electionId: string) {
  // TODO: Set election status to OPEN
}

export async function closeElection(electionId: string) {
  // TODO: Set election status to CLOSED
}

export async function addCandidate(electionId: string, formData: FormData) {
  // TODO: Add candidate to election
}

export async function submitKeyShare(electionId: string, share: string) {
  // TODO: Store key share, check if threshold reached
}

export async function tally(electionId: string) {
  // TODO: Reconstruct key, homomorphic aggregate, decrypt, store results
}
