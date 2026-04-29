"use client";

import { useState } from "react";
import type { Candidate } from "@/db/schema";
import { CredentialInput } from "./CredentialInput";
import { VotingWizard } from "./VotingWizard";

export function VotingContainer({
  electionId,
  candidates,
  paillierPubN,
  paillierPubG,
}: {
  electionId: number;
  candidates: Candidate[];
  paillierPubN: string;
  paillierPubG: string;
}) {
  const [credentials, setCredentials] = useState<{ token: string; signature: string } | null>(null);

  const handleValidCredentials = (token: string, signature: string) => {
    setCredentials({ token, signature });
  };

  if (!credentials) {
    return (
      <div className="mt-8">
        <CredentialInput 
          electionId={electionId} 
          onValidCredentials={handleValidCredentials} 
        />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <VotingWizard
        electionId={electionId}
        candidates={candidates}
        token={credentials.token}
        signature={credentials.signature}
        paillierPubN={paillierPubN}
        paillierPubG={paillierPubG}
      />
    </div>
  );
}
