'use client';

import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.svg"
        height={48}
        width={48}
        alt={`${APP_NAME} logo`}
        priority
      ></Image>
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">
          Could not find requested paged:\New folder\sample-data\sample-data\db
        </p>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={() => redirect('/')}
        >
          Back to home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
