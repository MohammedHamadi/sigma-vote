// Cryptographic types

export interface PaillierKeyPair {
  publicKey: {
    n: string; // BigInt as string
    g: string;
  };
  privateKey: {
    lambda: string;
    mu: string;
    n: string;
  };
}

export interface RSAKeyPair {
  publicKey: {
    n: string;
    e: string;
  };
  privateKey: {
    d: string;
  };
}

export interface KeyShare {
  index: number;
  data: string; // Shamir share data
}
