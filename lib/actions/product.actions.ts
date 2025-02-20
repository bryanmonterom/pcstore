'use server';
import { prisma } from '../../db/prisma';
import { convertToPlainObject, formatError } from '../utils';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validators';
import { z } from 'zod';

//Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data);
}

//Get product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}

export async function getAllProducts({
  query,
  page,
  limit = PAGE_SIZE,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  const data = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//delete product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) {
      throw new Error('Product not found');
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/admin/products');
    return { success: false, message: 'Product removed succesfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//create new product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);

    const fixedProduct = {
      ...product,
      images: product.images.filter((img) => img !== ''),
    };

    await prisma.product.create({
      data: fixedProduct,
    });
    revalidatePath('/admin/products');

    return { success: true, message: 'Product created succesfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);

    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) {
      throw new Error('Product not found');
    }

    await prisma.product.update({
      data: product,
      where: { id: product.id },
    });
    revalidatePath('/admin/products');
    return { success: true, message: 'Product updated succesfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
