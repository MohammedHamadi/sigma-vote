"use client";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { ShieldAlert } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0 mx-auto">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <ShieldAlert className="mx-auto h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Log in to view active elections</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
