'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Cart, CartItem } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon, LoaderCircle, ArrowRight } from 'lucide-react';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface CartTableProps {
  data: Cart;
}

const CartTable = ({ data }: CartTableProps) => {
  const { items, itemsPrice } = data;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Handle remove from cart
  const handleRemoveFromCart = async (productId: string) => {
    startTransition(async () => {
      const response = await removeItemFromCart(productId);
      if (!response?.success) {
        toast.error(response?.message || 'Failed to remove item from cart');
      } else {
        toast(response?.message);
        router.refresh();
      }
    });
  };

  // Handle add to cart
  const handleAddToCart = async (item: CartItem) => {
    startTransition(async () => {
      const response = await addItemToCart(item);
      if (!response?.success) {
        toast.error(response?.message || 'Failed to add item to cart');
      } else {
        toast(response?.message);
        router.refresh();
      }
    });
  };

  const calculateTotalQuantity = () => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      <div className="mt-4">
        {!items || items.length === 0 ? (
          <>
            Cart is empty. Go to{' '}
            <Link href="/" className="text-blue-500">
              home
            </Link>{' '}
            to add products.
          </>
        ) : (
          <>
            <div className="grid md:grid-cols-4 md:gap-5">
              <div className="overflow-x-auto md:col-span-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>
                          <Link href={`/product/${item.slug}`} className="flex items-center">
                            <Image src={item.image} alt={item.name} width={100} height={100} />
                            <span className="text-sm font-medium">{item.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell className="flex-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveFromCart(item.productId)}
                            className="cursor-pointer"
                            disabled={isPending}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </Button>
                          <div className="w-5 flex items-center justify-center">
                            {isPending ? (
                              <LoaderCircle className="size-4 animate-spin" />
                            ) : (
                              <span className="px-2">{item.quantity}</span>
                            )}
                          </div>
                          <Button
                            className="cursor-pointer"
                            variant="outline"
                            size="icon"
                            onClick={() => handleAddToCart(item)}
                            disabled={isPending}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">${Number(item.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Card className="gap-y-2 h-fit">
                <CardHeader className="text-lg font-bold">Subtotal:</CardHeader>
                <CardContent>
                  ({calculateTotalQuantity()}) {formatCurrency(itemsPrice)}
                </CardContent>
                <CardFooter className="pt-2 mt-4">
                  <Button
                    className="w-full cursor-pointer"
                    disabled={isPending}
                    onClick={() => startTransition(() => router.push('/shipping-address'))}
                  >
                    {isPending ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <ArrowRight size={4} />
                    )}
                    Proceed to checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartTable;
