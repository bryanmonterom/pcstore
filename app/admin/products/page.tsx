import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteProduct, getAllProducts } from '@/lib/actions/product.actions';
import { formatId, formatNumber } from '@/lib/utils';
import Link from 'next/link';
import { formatCurrency } from '../../../lib/utils';
import Pagination from '@/components/ui/shared/product/pagination';
import DeleteDialog from '@/components/ui/shared/delete-dialog';

const AdminProductPage = async (props: {
  searchParams: Promise<{ page: string; query: string; category: string }>;
}) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';
  const category = searchParams.category || '';

  const products = await getAllProducts({ query: searchText, page, category });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button asChild variant="default">
          <Link href="/admin/products/create">Create product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead> 
            <TableHead className='text-right'>PRICE</TableHead>
            <TableHead>CATEGORY</TableHead> 
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className='w-[100px]'>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {products.data.map((product)=>(
                <TableRow key={product.id}>
                  <TableCell>
                    {formatId(product.id)}
                  </TableCell>
                  <TableCell>
                    {product.name}
                  </TableCell>
                  <TableCell className='text-right'>
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell>
                    {product.category}
                  </TableCell>
                  <TableCell>
                    {formatNumber(product.stock)}
                  </TableCell>
                  <TableCell>
                    {product.rating}
                  </TableCell>
                  <TableCell className='flex gap-1'>
                    <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                    </Button>
                    <Button asChild variant='destructive' size='sm'>
                        <DeleteDialog action={deleteProduct} id={product.id}></DeleteDialog>
                    </Button>
                  </TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>
      {products.totalPages &&products.totalPages > 1 && (<Pagination page={page} totalPages={products.totalPages}></Pagination>)}
      
    </div>
  );
};

export default AdminProductPage;
