'use server';

import { z } from 'zod';
import { insertReviewSchema } from '../validators';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

//create & update reviews
export async function createAndUpdateReview(
  data: z.infer<typeof insertReviewSchema>,
) {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not authenticated');

    //confirm the data structure and fields against the zod validators
    const review = insertReviewSchema.parse({
      ...data,
      userId: session.user.id,
    });

    //get the product being reviewed
    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });

    if (!product) throw new Error('Product not found');

    const reviewExists = await prisma.review.findFirst({
      where: { productId: review.productId, userId: review.userId },
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        //Update current review
        await tx.review.update({
          where: { id: reviewExists.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        // add new review
        await tx.review.create({ data: review });
      }

      const avgRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      //get total reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      //update the rating and numreviews in product table

      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: avgRating._avg.rating || 0,
          numReviews,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`)
    return { sucess: true, message: 'Review updated succesfully'};

  } catch (error) {
    return { sucess: false, message: formatError(error) };
  }
}
