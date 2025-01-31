'use client';

import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/types';
import { useRouter } from 'next/navigation';
import { Button } from '../../button';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { ToastAction } from '../../toast';
import { Plus } from 'lucide-react';

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    const response = await addItemToCart(item);

    if (!response.success) {
      toast({
        variant: 'destructive',
        description: response.message,
      });
      return;
    }

    toast({
      description: `${item.name} added to cart`,
      action: (
        <ToastAction
          className="bg-primary text-white hover:bg-gray-800"
          altText="Go to Cart"
          onClick={() => router.push('/cart')}
        >
            Go to Cart
        </ToastAction>
      ),
    });
  };

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
     <Plus></Plus> Add to Cart
    </Button>
  );
};

export default AddToCart;
