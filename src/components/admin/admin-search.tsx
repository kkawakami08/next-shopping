"use client";

import { paths } from "@/lib/constants";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

const AdminSearch = () => {
  const pathname = usePathname();
  const formActionUrl = pathname.includes(paths.adminOrders())
    ? paths.adminOrders()
    : pathname.includes(paths.adminUsers())
    ? paths.adminUsers()
    : paths.adminProducts();

  const searchParams = useSearchParams();

  const lastSegment = pathname.split("/").filter(Boolean).at(-1);

  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder={`Search ${lastSegment}...`}
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="md:w-[100px] lg:w-[300px] "
      />
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  );
};

export default AdminSearch;
