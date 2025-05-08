import { Button } from "@/components/ui/button";
import { paths } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized Access",
};

const UnauthorizedPage = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)] ">
      <h1 className="text-4xl font-bold">Unauthorized Access</h1>
      <p className="text-muted-foreground">
        You do not have permission to access this page
      </p>
      <Button asChild>
        <Link href={paths.home()}>Return Home</Link>
      </Button>
    </div>
  );
};

export default UnauthorizedPage;
