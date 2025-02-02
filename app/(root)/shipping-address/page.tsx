import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShippingAddress } from '@/types';
import { getUserById } from '@/lib/actions/user.actions';
import ShippingAddressForm from './shipping-address-form';

export const metadata: Metadata = {
  title: 'Shipping Address',
};
const ShippingAddressPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) {
    redirect('/cart');
  }

  const session = await auth();
  const useriD = session?.user?.id;

  if (!useriD) {
    throw new Error('No UserId found');
  }
  const user = await getUserById(useriD);

  return (
    <>
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
