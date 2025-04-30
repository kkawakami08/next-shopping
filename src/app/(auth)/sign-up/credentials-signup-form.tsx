"use client";

import SubmitButton from "@/components/shared/form/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/lib/actions/user.actions";
import { paths, signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

const CredentialsSignUpForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [actionState, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            defaultValue={signUpDefaultValues.name}
            name="name"
            required
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            defaultValue={signUpDefaultValues.email}
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
            defaultValue={signUpDefaultValues.password}
            name="password"
            required
            autoComplete="password"
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            defaultValue={signUpDefaultValues.confirmPassword}
            name="confirmPassword"
            required
            autoComplete="confirmPassword"
          />
        </div>
        <div>
          <SubmitButton label="Sign Up" />
        </div>
        {actionState && !actionState.success && (
          <div className="text-center text-destructive">
            {actionState.message}
          </div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?
          <Button asChild variant={"link"}>
            <Link href={paths.signIn()} target="_self">
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignUpForm;
