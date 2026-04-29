import { paillierEncryptWithRandomness } from './paillier';
import { proveBallot, PaillierPublicKey } from './zkp';
import { serializeBallotProof, SerializedBallotProof } from './proof-serialization';
import { modPow, modInverse, randomBigIntInRange, gcd } from './bigint-utils';

export interface EncryptedBallotPackage {
  ciphertexts: string[];
  proofs: SerializedBallotProof;
}

/**
 * Encrypts a ballot and generates the corresponding zero-knowledge proofs.
 * Ensures the blinding factors are constrained such that their product is 1 mod N.
 *
 * @param selectedIndex The index of the selected candidate
 * @param numCandidates The total number of candidates
 * @param publicKey The Paillier public key for the election
 */
export async function encryptBallot(
  selectedIndex: number,
  numCandidates: number,
  publicKey: PaillierPublicKey
): Promise<EncryptedBallotPackage> {
  const N = BigInt(publicKey.n);
  const N2 = N * N;
  const g = BigInt(publicKey.g);

  const ciphertextsBigInt: bigint[] = [];
  const randomnesses: bigint[] = [];
  const votes: (0 | 1)[] = [];

  let rProduct = 1n;

  // Process the first n-1 candidates with fully random blinding factors
  for (let i = 0; i < numCandidates - 1; i++) {
    const vote = i === selectedIndex ? 1 : 0;
    votes.push(vote);

    const { ciphertext, randomness } = paillierEncryptWithRandomness(BigInt(vote), publicKey);
    ciphertextsBigInt.push(ciphertext);
    randomnesses.push(randomness);

    rProduct = (rProduct * randomness) % N;
  }

  // Constrain the blinding factor for the last candidate
  // r_n = (r_1 * r_2 * ... * r_{n-1})^-1 mod N
  const lastVote = numCandidates - 1 === selectedIndex ? 1 : 0;
  votes.push(lastVote);

  const rLast = modInverse(rProduct, N);
  randomnesses.push(rLast);

  // Compute the final ciphertext with the constrained rLast
  const cLast = (modPow(g, BigInt(lastVote), N2) * modPow(rLast, N, N2)) % N2;
  ciphertextsBigInt.push(cLast);

  // Generate the proofs
  const ballotProof = await proveBallot(ciphertextsBigInt, votes, randomnesses, publicKey);

  // Serialize everything for transport
  return {
    ciphertexts: ciphertextsBigInt.map(c => c.toString()),
    proofs: serializeBallotProof(ballotProof),
  };
}
