'use client';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { LoaderCircle, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { toast } from 'sonner';
import { useState } from 'react';

const AddToCart = ({ item }: { item: CartItem }) => {
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
        toast(`${item.name} added to cart`, {
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

  return (
    <div>
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
    </div>
  );
};

export default AddToCart;
