"use client";

import { useState } from "react";

import Link from "next/link";
import { Button } from "../../_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../_components/ui/card";
import { Input } from "../../_components/ui/input";
import { Label } from "../../_components/ui/label";
import { Separator } from "../../_components/ui/separator";
import { signIn } from "../actions";

export default function SignIn() {
  const [error, setError] = useState<string>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const res = await signIn(formData);
    if (res && res.error) {
      setError(res.error);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col p-6 gap-4">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {error && <p className="text-destructive">{error}</p>}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="nikolovlazar"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
