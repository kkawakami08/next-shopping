import { getUserById } from "@/lib/actions/user.actions";
import { notFound } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import UpdateUserForm from "./update-user-form";

export const metadata: Metadata = {
  title: "Edit User",
};

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

const EditUserPage = async ({ params }: EditUserPageProps) => {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="font-bold text-2xl">Update User</h1>
      <UpdateUserForm user={user} />
    </div>
  );
};

export default EditUserPage;
