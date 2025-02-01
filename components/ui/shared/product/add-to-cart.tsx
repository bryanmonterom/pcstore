'use client';

import { useToast } from '@/hooks/use-toast';
import { Cart, CartItem } from '@/types';
import { useRouter } from 'next/navigation';
import { Button } from '../../button';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { ToastAction } from '../../toast';
import { Minus, Plus } from 'lucide-react';

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
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
      description: `${response.message}`,
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

  const handleRemoveFromCart = async () => {
    const response = await removeItemFromCart(item.productId);

    toast({
      variant: response.success ? 'default' : 'destructive',
      description: `${response.message}`,
    });
  }

  //Check if item exists in cart
  const existsInCart =
    cart && cart?.items.find((x) => x.productId === item.productId);

  return existsInCart ? (
    <div>
      <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
        <Minus className='h-4 w-4'></Minus>
      </Button>
      <span className='px-2'>{existsInCart.quantity}</span>
      <Button type='button' variant='outline' onClick={handleAddToCart}>
        <Plus className='h-4 w-4'></Plus>
      </Button>
      </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {' '}
      <Plus></Plus> Add to Cart{' '}
    </Button>
  );
};

export default AddToCart;
