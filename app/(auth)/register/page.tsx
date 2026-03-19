"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock registration API call
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/login";
    }, 1000);
  };

  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0 mx-auto">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <ShieldAlert className="mx-auto h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your voter details below</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="p-4 pt-6">
              <CardTitle className="text-xl">Register</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Alice Smith" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email / Student ID</Label>
                <Input id="email" type="email" placeholder="alice@university.edu" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex-col gap-4">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
