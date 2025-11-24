'use client';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { LoaderCircle, PlusIcon, MinusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { toast } from 'sonner';
import { Cart } from '@/types';
import { useTransition } from 'react';

interface AddToCartProps {
  item: CartItem;
  cart?: Cart;
}

const AddToCart = (props: AddToCartProps) => {
  const { item, cart } = props;

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const response = await addItemToCart(item);
      if (!response?.success) {
        toast.error(response?.message || 'Failed to add item to cart');
      } else {
        // Handle success add to cart
        toast(response?.message, {
          action: {
            label: 'Go to Cart',
            onClick: () => router.push('/cart')
          }
        });
      }
    });
  };

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const response = await removeItemFromCart(item.productId);
      if (!response?.success) {
        toast.error(response?.message || 'Failed to remove item from cart');
      } else {
        toast(response?.message);
      }
    });
  };

  // Check if item is in cart
  const existingItem = cart?.items.find((x: CartItem) => x.productId === item.productId);

  return existingItem ? (
    <>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <MinusIcon className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existingItem.quantity}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <PlusIcon className="w-4 h-4" />
        )}
      </Button>
    </>
  ) : (
    <>
      <Button
        className="w-full cursor-pointer min-w-32"
        type="button"
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <>
            <PlusIcon />
            Add to Cart
          </>
        )}
      </Button>
    </>
  );
};

export default AddToCart;
