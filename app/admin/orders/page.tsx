import { deleteOrder, getAllOrders } from '@/lib/actions/order.action';
import { requireAdmin } from '@/lib/auth-guard';
import { Metadata } from 'next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import Pagination from '@/components/ui/shared/product/pagination';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import DeleteDialog from '@/components/ui/shared/delete-dialog';

export const metadata: Metadata = {
  title: 'Admin Orders',
};

const AdminOrderPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  const { page = '1', query: searchText } = await props.searchParams;
  await requireAdmin();

  const orders = await getAllOrders({ page: Number(page), query: searchText });
  console.log(orders);

  return (
    <div className="space-y-2 ">
      <div className="flex items-center gap-3">
          <h1 className="h2-bold">Orders</h1>
          {searchText &&(<div>Filtered by <i>&quot;{searchText}&quot;</i>{' '}
          <Link href='/admin/orders'><Button variant='outline' size='sm'>Clear filter</Button></Link></div> )}
        </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>BUYER</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'Not paid'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'Not delivered'}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  <DeleteDialog
                    id={order.id}
                    action={deleteOrder}
                  ></DeleteDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={orders.totalPages}
          ></Pagination>
        )}
      </div>
    </div>
  );
};

export default AdminOrderPage;
