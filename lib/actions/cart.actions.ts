'use server';

import { CartItem } from '@/types';
import { cookies } from 'next/headers';
import { convertToPlainObject, formatErrorMessage } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { roundNumberTo2DecimalPlaces } from '../utils';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

const SHIPPING_PRICE = 10;
const TAX_RATE = 0.15;

// Calculate cart total price
const calculateCartTotalPrice = (items: CartItem[]) => {
  const itemsPrice = roundNumberTo2DecimalPlaces(
    items.reduce((acc, item) => {
      return acc + Number(item.price) * item.quantity;
    }, 0)
  );

  const shippingPrice = roundNumberTo2DecimalPlaces(itemsPrice > 100 ? 0 : SHIPPING_PRICE);
  const taxPrice = roundNumberTo2DecimalPlaces(itemsPrice * TAX_RATE);
  const totalPrice = roundNumberTo2DecimalPlaces(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2)
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Session cart ID not found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId }
    });

    if (!product) throw new Error('Product not found');

    if (!cart) {
      // Create new cart
      const newCart = await insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calculateCartTotalPrice([item])
      });

      // Save cart to database
      await prisma.cart.create({
        data: newCart
      });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`
      };
    } else {
      // Check if item already in cart
      const existingItem = cart.items.find((x: CartItem) => x.productId === item.productId);

      if (existingItem) {
        // Check stock
        if (product.stock < existingItem.quantity + item.quantity) {
          throw new Error(`Only ${product.stock} ${product.name}s left in stock`);
        }

        // Update item quantity
        cart.items.find((x: CartItem) => x.productId === item.productId)!.quantity += item.quantity;
      } else {
        // Check stock
        if (product.stock < item.quantity)
          throw new Error(`Only ${product.stock} ${product.name}s left in stock`);

        // Add item to cart.items
        cart.items.push(item);
      }

      // Save cart to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calculateCartTotalPrice(cart.items as CartItem[])
        }
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existingItem ? 'updated in' : 'added to'} cart`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatErrorMessage(error)
    };
  }
}

export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Session cart ID not found');

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString()
  });
}
