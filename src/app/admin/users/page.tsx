import { requireAdmin } from "@/lib/auth-guard";
import React from "react";

const AdminUsersPage = async () => {
  await requireAdmin();
  return <div>AdminUsersPage</div>;
};

export default AdminUsersPage;
