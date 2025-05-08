import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { paths } from "./constants";

export const requireAdmin = async () => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    redirect(paths.unauthorized());
  }
};
