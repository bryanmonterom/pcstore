'use client';
import { createOrder } from '@/lib/actions/order.action';
import { useFormStatus } from 'react-dom';
import { Check, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const PlacerOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent )=> {

    event.preventDefault();

    const res = await createOrder();

    if(res.redirectTo){
        router.push(res.redirectTo)
    }
  }
  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin"></Loader>
        ) : (
          <Check className="h-4 w-4"></Check> 
        )} {' '} Place Order
      </Button>
    );
  };

  return <form onSubmit={handleSubmit} className="w-full">
    <PlaceOrderButton></PlaceOrderButton>
  </form>;
};

export default PlacerOrderForm;
