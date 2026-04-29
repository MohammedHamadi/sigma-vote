import { ZeroOrOneProof, SumEqualsOneProof, BallotProof } from './zkp';

export interface SerializedZeroOrOneProof {
  c0: string;
  e0: string;
  z0: string;
  c1: string;
  e1: string;
  z1: string;
}

export interface SerializedSumEqualsOneProof {
  commitment: string;
  challenge: string;
  response: string;
}

export interface SerializedBallotProof {
  perCandidateProofs: SerializedZeroOrOneProof[];
  sumProof: SerializedSumEqualsOneProof;
}

export function serializeZeroOrOneProof(proof: ZeroOrOneProof): SerializedZeroOrOneProof {
  return {
    c0: proof.c0.toString(),
    e0: proof.e0.toString(),
    z0: proof.z0.toString(),
    c1: proof.c1.toString(),
    e1: proof.e1.toString(),
    z1: proof.z1.toString(),
  };
}

export function deserializeZeroOrOneProof(proof: SerializedZeroOrOneProof): ZeroOrOneProof {
  return {
    c0: BigInt(proof.c0),
    e0: BigInt(proof.e0),
    z0: BigInt(proof.z0),
    c1: BigInt(proof.c1),
    e1: BigInt(proof.e1),
    z1: BigInt(proof.z1),
  };
}

export function serializeSumEqualsOneProof(proof: SumEqualsOneProof): SerializedSumEqualsOneProof {
  return {
    commitment: proof.commitment.toString(),
    challenge: proof.challenge.toString(),
    response: proof.response.toString(),
  };
}

export function deserializeSumEqualsOneProof(proof: SerializedSumEqualsOneProof): SumEqualsOneProof {
  return {
    commitment: BigInt(proof.commitment),
    challenge: BigInt(proof.challenge),
    response: BigInt(proof.response),
  };
}

export function serializeBallotProof(proof: BallotProof): SerializedBallotProof {
  return {
    perCandidateProofs: proof.perCandidateProofs.map(serializeZeroOrOneProof),
    sumProof: serializeSumEqualsOneProof(proof.sumProof),
  };
}

export function deserializeBallotProof(proof: SerializedBallotProof): BallotProof {
  return {
    perCandidateProofs: proof.perCandidateProofs.map(deserializeZeroOrOneProof),
    sumProof: deserializeSumEqualsOneProof(proof.sumProof),
  };
}
