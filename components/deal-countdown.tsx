'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';

//Static target date
const CURRENT_DATE = new Date();
const PROMO_DURATION = 30;
const PROMO_DATE = new Date(
  CURRENT_DATE.setDate(CURRENT_DATE.getDate() + PROMO_DURATION),
);

//function to calculate the remaining time
const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

const DealCountDown = () => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

  useEffect(() => {
    //Use effect for time
    //calculate time

    setTime(calculateTimeRemaining(PROMO_DATE));
    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(PROMO_DATE);
      setTime(newTime);

      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  if(!time){
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Loading countdown</h3>
        </div>
      </section>
    )
  }
  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ){
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Deal has ended</h3>
          <p>
          This deal is no longer available. Check out or latest promotions!
          </p>
          <div className="text-center">
            <Button asChild>
              <Link href="/search">View products</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="https://utfs.io/f/uj69Yfd3plC6zd6oTMrxQGJlUXqtE4gw8pIc5LZejdru9KSs"
            alt="promo"
            width={300}
            height={200}
          ></Image>
        </div>
      </section>
    )
  }
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Deal of the Month</h3>
        <p>
          Get ready for a shopping experience like never before with our Deals
          of the Month! Every purchase comes with exclusive perks and offers,
          making this month a celebration of savvy choices and amazing deals.
          Don&apos;t miss out! 🎁🛒
        </p>
        <ul className="grid grid-cols-4">
          <StatBox label="Days" value={time.days}></StatBox>
          <StatBox label="Hours" value={time.hours}></StatBox>
          <StatBox label="Minutes" value={time.minutes}></StatBox>
          <StatBox label="Seconds" value={time.seconds}></StatBox>
        </ul>
        <div className="text-center">
          <Button asChild>
            <Link href="/search">View products</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src="https://utfs.io/f/uj69Yfd3plC6zd6oTMrxQGJlUXqtE4gw8pIc5LZejdru9KSs"
          alt="promo"
          width={300}
          height={200}
        ></Image>
      </div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className="p-4 w-full text-center">
    <p className="text-3xl font-bold">{value}</p>
    <p>{label}</p>
  </li>
);

export default DealCountDown;
