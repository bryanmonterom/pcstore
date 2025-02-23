import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DeleteDialog from '@/components/ui/shared/delete-dialog';
import Pagination from '@/components/ui/shared/product/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions';
import { requireAdmin } from '@/lib/auth-guard';
import { formatId } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Users',
};

const AdminUsersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page = 1 } = await props.searchParams;
    await requireAdmin();
  const users = await getAllUsers({ page: Number(page) });
  return (
    <div className="space-y-2 ">
      <h2 className="h2-bold">Orders</h2>
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
                  {user.role === 'user' ? (
                    <Badge variant="secondary">{user.role}</Badge>
                  ) : (
                    <Badge variant="default">{user.role}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog
                    id={user.id}
                    action={deleteUser}
                  ></DeleteDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={users.totalPages}
          ></Pagination>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
