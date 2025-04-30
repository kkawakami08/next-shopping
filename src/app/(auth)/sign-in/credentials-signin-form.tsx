"use client";

import SubmitButton from "@/components/shared/form/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { paths, signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

const CredentialsSignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [actionState, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            defaultValue={signInDefaultValues.email}
            name="email"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            defaultValue={signInDefaultValues.password}
            name="password"
            required
            autoComplete="password"
          />
        </div>
        <div>
          <SubmitButton label="Sign In" />
        </div>
        {actionState && !actionState.success && (
          <div className="text-center text-destructive">
            {actionState.message}
          </div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t hahve an account?
          <Button asChild variant={"link"}>
            <Link href={paths.signUp()} target="_self">
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
