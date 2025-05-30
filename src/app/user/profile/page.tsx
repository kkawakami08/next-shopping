import React from "react";
import ProfileForm from "./profile-form";
import { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Customer Profile",
};

const ProfilePage = async () => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Profile</h2>
        <ProfileForm />
      </div>
    </SessionProvider>
  );
};

export default ProfilePage;
