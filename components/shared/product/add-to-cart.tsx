'use client';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { LoaderCircle, PlusIcon, MinusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { Cart } from '@/types';

interface AddToCartProps {
  item: CartItem;
  cart?: Cart;
}

const AddToCart = (props: AddToCartProps) => {
  const { item, cart } = props;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    setIsLoading(true);
    try {
      const response = await removeItemFromCart(item.productId);
      if (!response?.success) {
        toast.error(response?.message || 'Failed to remove item from cart');
      } else {
        toast(response?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check if item is in cart
  const existingItem = cart?.items.find((x: CartItem) => x.productId === item.productId);

  return existingItem ? (
    <>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        <MinusIcon className="w-4 h-4" />
      </Button>
      <span className="px-2">{existingItem.quantity}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        <PlusIcon className="w-4 h-4" />
      </Button>
    </>
  ) : (
    <>
      <Button
        className="w-full cursor-pointer min-w-32"
        type="button"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? (
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
