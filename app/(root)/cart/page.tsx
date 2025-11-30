import CartTable from './cart-table';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Shopping Cart'
};

const CartPage = async () => {
  const cart = await getMyCart();

  if (!cart) notFound();

  return (
    <>
      <CartTable data={cart} />
    </>
  );
};

export default CartPage;
