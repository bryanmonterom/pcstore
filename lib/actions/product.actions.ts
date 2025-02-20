'use server';
import { prisma } from '../../db/prisma';
import { convertToPlainObject } from '../utils';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';

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
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
