import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { getAllUsers } from "@/lib/actions/user.actions";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { deleteUser } from "@/lib/actions/user.actions";
import { paths } from "@/lib/constants";
import { formatId } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Admin Users",
};

interface AdminUserPageProps {
  searchParams: Promise<{ page: string; query: string }>;
}

const AdminUserPage = async (props: AdminUserPageProps) => {
  await requireAdmin();

  const { page = "1", query: searchText } = await props.searchParams;

  const users = await getAllUsers({
    page: Number(page),
    query: searchText,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Users</h1>
        {searchText && (
          <div>
            Filtered by <i>&quot;{searchText}&quot;</i>{" "}
            <Link href={paths.adminUsers()}>
              <Button variant={"outline"} size={"sm"}>
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === "user" ? (
                    <Badge variant={"secondary"}>User</Badge>
                  ) : (
                    <Badge>Admin</Badge>
                  )}
                </TableCell>

                <TableCell className="flex items-center gap-2">
                  <Button asChild variant={"outline"} size={"sm"}>
                    <Link href={paths.adminUserPage(user.id)}>Edit</Link>
                  </Button>
                  {/* DELETE */}
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users.totalPages} />
        )}
      </div>
    </div>
  );
};

export default AdminUserPage;
