'use client';

import { Product } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../carousel';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import Image from 'next/image';

const ProductCarousel = ({ data }: { data: Product[] }) => {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
      className="w-full mb-12"
    >
      <CarouselContent>
        {data.map((product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <div className="relative mx-auto">
                <Image
                  src={product.banner!}
                  alt={product.name}
                  height="0"
                  width="0"
                  sizes="100vw"
                  className="w-full h-auto"
                ></Image>
                <div className="absolute inset-0 flex items-end justify-center">
                  <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
                    {product.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious></CarouselPrevious>
      <CarouselNext></CarouselNext>
    </Carousel>
  );
};

export default ProductCarousel;
