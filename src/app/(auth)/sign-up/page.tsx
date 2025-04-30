import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME, paths } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CredentialsSignUpForm from "./credentials-signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

interface SignUpPageProps {
  searchParams: Promise<{ callbackUrl: string }>;
}

const SignUpPage = async ({ searchParams }: SignUpPageProps) => {
  const { callbackUrl } = await searchParams;

  const session = await auth();

  //*TODO Check callback url stuff

  if (session) {
    return redirect(callbackUrl || paths.home());
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link
            href={paths.home()}
            className="flex items-center justify-center"
          >
            <Image
              src={"/images/logo.svg"}
              alt={`${APP_NAME} logo`}
              width={100}
              height={100}
              priority
            />
          </Link>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information below to sign up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
