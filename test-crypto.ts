import { modPow, isPrime, modInverse, gcd } from './lib/crypto/bigint-utils';
import { generatePaillierKeypair, paillierEncrypt, paillierDecrypt, homomorphicAdd } from './lib/crypto/paillier';
import { splitSecret, reconstructSecret } from './lib/crypto/shamir';
import { generateBlindingFactor, blindMessage, signBlinded, unblindSignature, verifySignature } from './lib/crypto/blind-signature';
import { proveZeroOrOne, verifyZeroOrOne } from './lib/crypto/zkp';

async function runTests() {
  console.log("Running Crypto Tests...");

  console.log("1. BigInt Utils...");
  if (!isPrime(17n) || isPrime(15n)) throw new Error("isPrime failed");
  if (modPow(2n, 10n, 1000n) !== 24n) throw new Error("modPow failed");
  if (modInverse(3n, 11n) !== 4n) throw new Error("modInverse failed");
  console.log("✅ BigInt Utils passed!");

  console.log("2. Paillier (2048-bit primes)...");
  console.time("paillier_keygen");
  const pKeys = generatePaillierKeypair();
  console.timeEnd("paillier_keygen");
  
  const m1 = 42n;
  const m2 = 58n;
  const c1 = paillierEncrypt(m1, pKeys.publicKey);
  const c2 = paillierEncrypt(m2, pKeys.publicKey);
  const cSum = homomorphicAdd(c1, c2, pKeys.publicKey);
  const mSum = paillierDecrypt(cSum, pKeys.privateKey);
  if (mSum !== 100n) throw new Error("Paillier homomorphic add failed");
  console.log("✅ Paillier passed!");

  console.log("3. Shamir...");
  const secret = 123456789n;
  const shares = splitSecret(secret, 5, 3);
  const recovered3 = reconstructSecret([shares[0], shares[2], shares[4]]);
  if (recovered3 !== secret) throw new Error(`Shamir failed: expected ${secret}, got ${recovered3}`);
  const recovered2 = reconstructSecret([shares[0], shares[1]]);
  if (recovered2 === secret) throw new Error("Shamir reconstructed with too few shares!");
  console.log("✅ Shamir passed!");

  console.log("4. Blind Signature...");
  const rsaKeys = {
    publicKey: { n: "3233", e: "17" },
    privateKey: { d: "2753", n: "3233" }
  };
  const msg = 123n;
  const r = generateBlindingFactor(rsaKeys.publicKey);
  const blindedM = blindMessage(msg, r, rsaKeys.publicKey);
  const blindedS = signBlinded(blindedM, rsaKeys.privateKey);
  const unblindedS = unblindSignature(blindedS, r, rsaKeys.publicKey);
  const isValid = verifySignature(msg, unblindedS, rsaKeys.publicKey);
  if (!isValid) throw new Error("Blind Signature verification failed");
  console.log("✅ Blind Signature passed!");

  console.log("5. ZKP...");
  const rZero = 1234n;
  const nBig = BigInt(pKeys.publicKey.n);
  const n2 = nBig * nBig;
  const gBig = BigInt(pKeys.publicKey.g);
  const cZeroManual = (modPow(gBig, 0n, n2) * modPow(rZero, nBig, n2)) % n2;
  const proofZero = proveZeroOrOne(cZeroManual, 0, rZero, pKeys.publicKey);
  if (!verifyZeroOrOne(cZeroManual, proofZero, pKeys.publicKey)) throw new Error("ZKP for 0 failed");

  const rOne = 5678n;
  const cOneManual = (modPow(gBig, 1n, n2) * modPow(rOne, nBig, n2)) % n2;
  const proofOne = proveZeroOrOne(cOneManual, 1, rOne, pKeys.publicKey);
  if (!verifyZeroOrOne(cOneManual, proofOne, pKeys.publicKey)) throw new Error("ZKP for 1 failed");

  console.log("✅ ZKP passed!");

  console.log("🎉 All tests passed successfully!");
}

runTests().catch(console.error);
