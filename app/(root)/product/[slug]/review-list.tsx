'use client';

import { Review } from '@/types';
import Link from 'next/link';
import { useState } from 'react';
import ReviewForm from './review-form';

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reviews, setReviews] = useState<Review[]>([]);

  const reload = () =>{
    
  }


  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (<>
     <ReviewForm userId={userId} productId={productId} onReviewSubmitted={reload}></ReviewForm>
      </>) : (
        <div> Please
        <Link className='text-blue-700 px-2' href={`/sign-in?callbackUrl=/product/${productSlug}`}>Sign in</Link>
        To write a review
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* Reviews here */}
      </div>
    </div>
  );
};

export default ReviewList;
