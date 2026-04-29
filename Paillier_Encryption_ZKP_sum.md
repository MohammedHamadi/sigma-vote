## Proposed Zero-Knowledge Proof for Ballot Sum Validity Using the Paillier Cryptosystem

**Hamadi Mohammed Abdellah**
**Group 12**
**April 19, 2026**

---

### Context

In our secure e-voting prototype (S009), each voter submits a ballot consisting of $n$ encrypted choices, one for each candidate. Let $m_{i}\in\{0,1\}$ represent the vote for candidate $i$. A valid ballot must contain exactly one vote for a single candidate, meaning the sum of the plaintexts must equal 1:

$$\sum_{i=1}^{n}m_{i}=1$$

To prove the validity of the ballot without revealing the individual votes, we utilize the additive homomorphic properties of the Paillier cryptosystem alongside a constrained randomness technique.

---

### Proof of Sum Validity

Let the Paillier encryption for each candidate's vote $i\in\{1,...,n\}$ be defined as:

$$C_{i}\equiv g^{m_{i}}r_{i}^{N}(mod~N^{2})$$
**(1)**

where $g$ is the generator, $N$ is the RSA modulus, and $r_{i}$ is a random blinding factor chosen from $\mathbb{Z}_{N}^{*}$.

#### Constraining the Blinding Factors

Instead of choosing fully independent random blinding factors for all $n$ candidates, we choose independent random values for $r_{1}$ through $r_{n-1}$. We then specifically compute $r_{n}$ such that the product of all blinding factors equals 1 modulo $N^{2}$:

$$\prod_{i=1}^{n}r_{i}\equiv1(mod~N^{2})$$
**(2)**

---

### Homomorphic Aggregation

When the server verifies the ballot, it computes the product of all ciphertexts $C_{i}$. Due to the homomorphic property of the Paillier cipher, this expands as follows:

$$\prod_{i=1}^{n}C_{i}=\prod_{i=1}^{n}(g^{m_{i}}r_{i}^{N})(mod~N^{2})$$

By grouping the terms, we get:

$$\prod_{i=1}^{n}C_{i}=g^{\sum_{i=1}^{n}m_{i}}(\prod_{i=1}^{n}r_{i})^{N}(mod~N^{2})$$
**(3), (4)**

Substituting our constrained blinding factor condition from Equation (2), the term $(\prod_{i=1}^{n}r_{i})^{N}$ becomes $1^{N}=1$. The equation simplifies to:

#### Verification Condition

$$\prod_{i=1}^{n}C_{i}\equiv g^{\sum_{i=1}^{n}m_{i}}(mod~N^{2})$$
**(5)**

For a correctly formed ballot, the voter has selected exactly one candidate, meaning $\sum_{i=1}^{n}m_{i}=1$. Substituting this into Equation (5) yields:

#### Conclusion

$$\prod_{i=1}^{n}C_{i}\equiv g^{1}\equiv g(mod~N^{2})$$
**(6)**

By testing if $\prod_{i=1}^{n}C_{i}\equiv g(mod~N^{2})$, the server can cryptographically verify that the sum of the encrypted votes is exactly 1. Because the individual blinding factors $r_{1}...r_{n-1}$ remain random, the semantic security of the individual ciphertexts $C_{i}$ is preserved.
