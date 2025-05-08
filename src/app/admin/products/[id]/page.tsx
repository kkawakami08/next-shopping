import { requireAdmin } from "@/lib/auth-guard";
import React from "react";

const AdminProductsPage = async () => {
  await requireAdmin();
  return <div>AdminOrdersPage</div>;
};

export default AdminProductsPage;
