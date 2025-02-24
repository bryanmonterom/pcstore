import { getAllCategories } from '@/lib/actions/product.actions';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../drawer';
import { Button } from '../../button';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

const CategoryDrawer = async () => {
  const data = await getAllCategories();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon></MenuIcon>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Selected category</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-1 mt-4">
            {data.map((x)=>(
                <Button variant='ghost' key={x.category} className='w-full justify-start' asChild>
                        <DrawerClose asChild >
                            <Link href={`/search?category=${x.category}`}>
                            {x.category} ( {x._count} )</Link>
                        </DrawerClose>
                </Button>
            ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
