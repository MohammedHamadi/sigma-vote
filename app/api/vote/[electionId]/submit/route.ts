import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getElectionById } from "@/db-actions/elections";
import { insertBallot } from "@/db-actions/ballots";
import { isTokenUsedInElection, markTokenUsed } from "@/db-actions/usedTokens";
import { verifySignature } from "@/lib/crypto/blind-signature";
import { verifyZeroOrOne } from "@/lib/crypto/zkp";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ electionId: string }> }
) {
  try {
    const { electionId } = await params;
    const id = parseInt(electionId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid election ID" }, { status: 400 });
    }

    const election = await getElectionById(id);
    if (!election) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }
    if (election.status !== "OPEN") {
      return NextResponse.json({ error: "Election is not open" }, { status: 403 });
    }

    const body = await request.json();
    const { token, signature, ciphertexts, proofs } = body as {
      token: string;
      signature: string;
      ciphertexts: string[];
      proofs: unknown[];
    };

    if (!token || !signature || !ciphertexts || !proofs) {
      return NextResponse.json(
        { error: "Missing required fields: token, signature, ciphertexts, proofs" },
        { status: 400 }
      );
    }

    const tokenBigInt = BigInt(token);
    const signatureBigInt = BigInt(signature);
    const rsaPublicKey = { n: election.rsaPubN, e: election.rsaPubE };

    const sigValid = verifySignature(tokenBigInt, signatureBigInt, rsaPublicKey);
    if (!sigValid) {
      return NextResponse.json({ error: "Invalid blind signature" }, { status: 400 });
    }

    const alreadyUsed = await isTokenUsedInElection(token, id);
    if (alreadyUsed) {
      return NextResponse.json({ error: "Token already used" }, { status: 409 });
    }

    const paillierPublicKey = { n: election.paillierPubN, g: election.paillierPubG };
    for (let i = 0; i < ciphertexts.length; i++) {
      const ciphertext = BigInt(ciphertexts[i]);
      const proofValid = verifyZeroOrOne(ciphertext, proofs[i], paillierPublicKey);
      if (!proofValid) {
        return NextResponse.json(
          { error: `Invalid ZKP for ciphertext at index ${i}` },
          { status: 400 }
        );
      }
    }

    await insertBallot({
      electionId: id,
      ballotToken: token,
      ciphertexts: JSON.stringify(ciphertexts),
      proofs: JSON.stringify(proofs),
    });

    await markTokenUsed(id, token);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
