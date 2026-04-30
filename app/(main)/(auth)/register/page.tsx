"use client";

import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { ShieldAlert } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0 mx-auto">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <ShieldAlert className="mx-auto h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Join SigmaVote</h1>
          <p className="text-sm text-muted-foreground">Create an account to participate in elections</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
