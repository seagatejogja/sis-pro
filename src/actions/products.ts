'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { created_at: 'desc' },
      where: { is_active: true }
    });
    return { success: true, data: products }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createProduct(data: {
  id: string;
  category: string;
  brand: string;
  model_name: string;
  unit: string;
  min_stock: number;
  qr_code?: string;
  description?: string;
}) {
  try {
    const product = await prisma.product.create({
      data: {
        ...data,
      }
    });
    revalidatePath('/products');
    return { success: true, data: product }
  } catch (error: any) {
    return { success: false, error: 'Failed to create product: ' + error.message }
  }
}

export async function toggleProductStatus(id: string, is_active: boolean) {
  try {
    await prisma.product.update({
      where: { id },
      data: { is_active }
    });
    revalidatePath('/products');
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
