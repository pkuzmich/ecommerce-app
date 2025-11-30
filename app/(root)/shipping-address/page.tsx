import { Metadata } from 'next';
import { getMyCart } from '@/lib/actions/cart.actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.actions';

export const metadata: Metadata = {
  title: 'Shipping Address'
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect('/cart');

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;
  if (!userId) redirect('/signin');
  const user = await getUserById(userId);

  return (
    <div>
      <h1>Shipping Address</h1>
    </div>
  );
};

export default ShippingAddressPage;
